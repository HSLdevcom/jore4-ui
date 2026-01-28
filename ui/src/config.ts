import { DateTime } from 'luxon';

type JoreConfig = {
  // Here, but if you want to enable some check during dev only
  // you should test that directly with: process.env.NODE_ENV === 'development'
  // instead. That way the code gets completely eliminated from the production
  // code by the bundler when it sees static false condition.
  readonly nodeEnv: string;

  readonly logAllApolloErrors: boolean;

  readonly digitransitApiKey: string;
  readonly hasuraUrl: string;

  readonly buildTime: DateTime | null;
  readonly gitHash: string | null;
};

type PartialJoreConfigFile = Partial<Readonly<Record<string, unknown>>>;

/**
 * We are not truly using SSR, but Next.js forces it on us nonetheless.
 */
function inNextJsServerSideRenderPhase() {
  return typeof window !== 'object' || window === null;
}

function getGlobalConfigJsonObj(): PartialJoreConfigFile {
  if (inNextJsServerSideRenderPhase()) {
    return {};
  }

  const { joreConfig } = window;
  if (typeof joreConfig !== 'object' || joreConfig === null) {
    throw new Error(
      [
        'Proper JoreConfig not defined in index.html!',
        'Expected an object but values is:',
        `typeof(${typeof joreConfig});`,
        `String(${String(joreConfig)});`,
        `JSON.stringify(${JSON.stringify(joreConfig)})`,
      ].join(' '),
    );
  }

  return joreConfig as PartialJoreConfigFile;
}

const notValidValue = Symbol('jore4.config.NotValiValue');
type NotValidValue = typeof notValidValue;

type ConfigValueProcessor<Type> = (value: unknown) => Type | NotValidValue;

function readConfigValue<Type>(
  name: string,
  processValue: ConfigValueProcessor<Type>,
  errorStr: string,
  ...fallBackValues: ReadonlyArray<undefined | null | unknown>
) {
  const configFile = getGlobalConfigJsonObj();
  const configFileValue = configFile[name];

  const configValueCandidates = [configFileValue, ...fallBackValues];

  for (const value of configValueCandidates) {
    const processedValue = processValue(value);
    if (processedValue !== notValidValue) {
      return processedValue;
    }
  }

  const context = JSON.stringify({ configFile, configValueCandidates });

  throw new Error(
    `Failed to find config value '${name}'! ${errorStr}\ncontext: ${context}`,
  );
}

function readNotEmptyStringConfig(
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): string {
  return readConfigValue<string>(
    name,
    (value) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== '') {
          return value;
        }
      }

      return notValidValue;
    },
    'Expected to find a non empty string.',
    ...fallBackValues,
  );
}

function readStringConfig(
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): string {
  return readConfigValue<string>(
    name,
    (value) => {
      if (typeof value === 'string') {
        return value;
      }

      return notValidValue;
    },
    'Expected to find a string.',
    ...fallBackValues,
  );
}

const trueLikeString = ['true', 'yes', 'on'];
const falseLikeStrings = ['false', 'no', 'off'];

function readBoolean(
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): boolean {
  return readConfigValue<boolean>(
    name,
    (value) => {
      if (typeof value === 'boolean') {
        return value;
      }

      const str = String(value);
      if (trueLikeString.includes(str)) {
        return true;
      }

      if (falseLikeStrings.includes(str)) {
        return false;
      }

      return notValidValue;
    },
    'Expected to find a boolean (like) value.',
    ...fallBackValues,
  );
}

function converToNumber(value: unknown): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed !== '') {
      return Number(trimmed);
    }
  }

  return Number.NaN;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function readFiniteNumber(
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): number {
  return readConfigValue<number>(
    name,
    (value) => {
      const number = converToNumber(value);

      if (Number.isFinite(number)) {
        return number;
      }

      return notValidValue;
    },
    'Expected to find a valid number value.',
    ...fallBackValues,
  );
}

function readDateTime(
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): DateTime {
  return readConfigValue<DateTime>(
    name,
    (value) => {
      // if already DateTime, return as is
      if (DateTime.isDateTime(value)) {
        return value;
      }

      if (typeof value === 'string') {
        const dt = DateTime.fromISO(value.trim());
        if (dt.isValid) {
          return dt;
        }
      }

      return notValidValue;
    },
    'Expected to find a valid Date or DateTime value.',
    ...fallBackValues,
  );
}

function optional<Type>(
  reader: (name: string, ...fallBackValues: ReadonlyArray<unknown>) => Type,
  name: string,
  ...fallBackValues: ReadonlyArray<unknown>
): Type | null {
  try {
    return reader(name, ...fallBackValues);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
}

function ssrPlaceholder(value: unknown): unknown {
  if (inNextJsServerSideRenderPhase()) {
    return value;
  }

  return undefined;
}

export const joreConfig: JoreConfig = {
  nodeEnv: readNotEmptyStringConfig('nodeEnv', process.env.NODE_ENV),

  logAllApolloErrors: readBoolean(
    'logAllApolloErrors',
    process.env.LOG_ALL_APOLLO_ERRORS,
    process.env.NODE_ENV === 'development',
  ),

  digitransitApiKey: readNotEmptyStringConfig(
    'digitransitApiKey',
    process.env.NEXT_PUBLIC_DIGITRANSIT_API_KEY,
    ssrPlaceholder(
      'THIS PLACEHOLDER IS NEVER USED WHEN RUNNING THE CODE FOR REAL',
    ),
  ),
  hasuraUrl: readNotEmptyStringConfig(
    'hasuraUrl',
    process.env.HASURA_URL,
    '/api/graphql/v1/graphql',
  ),

  buildTime: optional(readDateTime, 'buildTime'),
  gitHash: optional(
    readStringConfig,
    'gitHash',
    process.env.NEXT_PUBLIC_GIT_HASH,
    '',
  ),
};
