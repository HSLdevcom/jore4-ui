import difference from 'lodash/difference';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Translations<T> = {
  readonly fi: T;
  readonly en: T;
};

type TranslationFile = {
  readonly raw: string;
  readonly lines: ReadonlyArray<string>;
  readonly json: unknown;
};

function loadTranslationFile(lang: string): TranslationFile {
  const file = resolve(__dirname, `./${lang}/common.json`);

  try {
    const raw = readFileSync(file, 'utf-8');
    const lines = raw.split('\n').map((line) => line.trim());
    const json = JSON.parse(raw);

    return { raw, lines, json };
  } catch (cause) {
    throw new Error(
      `Failed to load translation file (${file}) for lang (${lang})!`,
      { cause },
    );
  }
}

function loadTranslationFiles(): Translations<TranslationFile> {
  return {
    fi: loadTranslationFile('fi-FI'),
    en: loadTranslationFile('en-US'),
  };
}

type Paths = Array<string> | string;

function getPaths(lang: string, path: string, obj: object): Array<string>;
function getPaths(lang: string, path: string, obj: unknown): Paths;
function getPaths(lang: string, path: string, obj: unknown): Paths {
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).flatMap(([key, value]) =>
      getPaths(lang, `${path ? `${path}.` : ''}${key}`, value),
    );
  }

  if (typeof obj === 'string') {
    return path;
  }

  throw new TypeError(
    `Expected value at path (${lang}/common.json|${path}) to be an object or string, but it was typeof(${obj}) | String(${obj})`,
  );
}

function getTranslationKeys(lang: string, obj: unknown): Array<string> {
  if (typeof obj === 'object' && obj !== null) {
    return getPaths(lang, '', obj);
  }

  throw new TypeError(
    `Expected root node to be an object, but it was typeof(${obj}) | String(${obj})`,
  );
}

type TranslationTestData = TranslationFile & {
  readonly keys: ReadonlyArray<string>;
};

function loadTranslations(): Translations<TranslationTestData> {
  const files = loadTranslationFiles();

  return {
    fi: { ...files.fi, keys: getTranslationKeys('fi-FI', files.fi.json) },
    en: { ...files.en, keys: getTranslationKeys('en-US', files.en.json) },
  };
}

function assertTranslationKeysIdentical(
  data: Translations<TranslationTestData>,
) {
  const {
    fi: { keys: fiKeys },
    en: { keys: enKeys },
  } = data;

  const notInFi = difference(fiKeys, enKeys);
  const notInEn = difference(enKeys, fiKeys);

  const keyMismatches = [
    notInFi.length
      ? `Keys defined in the Finnish translation, but not in the English one:\n[${notInFi.join(', ')}]`
      : null,

    notInEn.length
      ? `Keys defined in the English translation, but not in the Finnish one:\n[${notInEn.join(', ')}]`
      : null,
  ].filter((it) => it !== null);

  if (keyMismatches.length) {
    throw new Error(
      `Expected all translations files to have same translation keys, but:\n ${keyMismatches.join('\n\n')}`,
    );
  }
}

/**
 * Assumes the localization files are properly prettified and valid JSON,
 * with no duplicate keys, with one identifier per row.
 */
function findKeyRowNumber(lines: ReadonlyArray<string>, key: string) {
  const sections = key.split('.');

  let sectionIndex = 0;
  let lineNumber = 0;

  for (; lineNumber < lines.length; lineNumber += 1) {
    const section = sections[sectionIndex];
    const line = lines[lineNumber];

    // Seek done, section found;
    // else keep iterating lines until we find the section
    if (line.startsWith(`"${section}":`)) {
      // This is the last section, return the line number.
      if (sectionIndex === sections.length - 1) {
        return lineNumber;
      }

      // We have more sections to find. Keep seeking
      sectionIndex += 1;
    }
  }

  throw new Error(
    `Expected to find key ${key} from the given line set, but it was not found!`,
  );
}

function assertTranslationKeysAreInSameOrder(
  data: Translations<TranslationTestData>,
) {
  const { fi, en } = data;
  const mismatchedRows = fi.keys
    .map((fiKey, index) => {
      const enKey = en.keys[index];
      if (fiKey === enKey) {
        return null;
      }

      return fiKey;
    })
    .filter((it) => it !== null)
    .map((key) => {
      const fiKeyLoc = findKeyRowNumber(fi.lines, key);
      const enKeyLoc = findKeyRowNumber(en.lines, key);

      const unexpectedContent = en.lines[fiKeyLoc];

      return `Key(${key}) expected on line ${fiKeyLoc + 1} found on line ${enKeyLoc + 1}. Line ${fiKeyLoc + 1} contains: ${unexpectedContent}`;
    });

  if (mismatchedRows.length) {
    throw new Error(
      `The translation keys on the English translation file should be in the same order as in the Finnish!\nBut the following differences were found:\n${mismatchedRows.join('\n')}`,
    );
  }
}

describe('Locales are identical', () => {
  let data: Translations<TranslationTestData>;

  beforeAll(() => {
    data = loadTranslations();
  });

  it('Translation keys should match', () => {
    expect(() => assertTranslationKeysIdentical(data)).not.toThrow();
  });

  it('Translation keys should be in the same order', () => {
    // If the translations don't contain same keys, we cannot compare their order
    expect(() => assertTranslationKeysIdentical(data)).not.toThrow();
    expect(() => assertTranslationKeysAreInSameOrder(data)).not.toThrow();
  });
});
