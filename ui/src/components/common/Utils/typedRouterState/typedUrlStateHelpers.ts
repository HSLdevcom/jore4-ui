import { ZodArray, ZodTypeAny, z } from 'zod';
import { knownPriorityValues } from '../../../../types/enums';
import { AllOptionEnum } from '../../../../utils';

const quayNetexPrefix = 'HSL:Quay:';
export const SEPARATOR = ',';

export function serializeArray<ValueT>(values: ReadonlyArray<ValueT>): string {
  return values.map(String).join(SEPARATOR);
}

/**
 * Split string into array on separator, with handling for empty strings.
 *
 * @param value string to split
 * @param separator string to split on
 */
export function splitString(
  value: string,
  separator: string = SEPARATOR,
): Array<string> {
  if (value.length === 0) {
    return [];
  }

  return value.split(separator);
}

/**
 * Create a deserializer for String enum `enum My { A='a', B='b' }`
 *
 * @param knownValues Object.values(MyEnum)
 */
export function toEnum<T extends string>(
  knownValues: ReadonlyArray<T>,
): (value: string) => T {
  return (value) => {
    if (knownValues.includes(value as ExplicitAny)) {
      return value as unknown as T;
    }

    throw new TypeError(
      `Value (${value}) is not a valid enum value! Known values are: ${knownValues}`,
    );
  };
}

/**
 * Create a deserializer for Integer enum `enum My { A = 1, B = 2 }`
 *
 * @param knownValues Object.values(MyEnum)
 */
export function toIntEnum<T extends number>(
  knownValues: ReadonlyArray<T>,
): (value: string) => T {
  return (value) => {
    const parsed = Number(value);
    if (knownValues.includes(parsed as ExplicitAny)) {
      return parsed as unknown as T;
    }

    throw new TypeError(
      `Value (${value}) is not a valid enum value! Known values are: ${knownValues}`,
    );
  };
}

const toPriority = toIntEnum(knownPriorityValues);

export function parsePriorities(value: string) {
  return splitString(value).map(toPriority);
}

/**
 * Strip the common 'HSL:Quay:' prefix away from the ids, to save bytes available
 * for the URL.
 *
 * @param value list of ids
 */
export function serializeQuayNetexIdList(value: ReadonlyArray<string>) {
  return value.map((id) => id.replace(quayNetexPrefix, '')).join(SEPARATOR);
}
/**
 * Add back the stripped 'HSL:Quay:' prefix back onto the ids.
 *
 * @param value list of ids
 */
export function parseQuayNetexIdList(value: string): ReadonlyArray<string> {
  return splitString(value).map((id) => `${quayNetexPrefix}${id}`);
}

/**
 * If All is included -> [All]
 * If empty -> [All]
 * Else -> [input list]
 *
 * @param values
 */
function cleanupEnumArrayWithAllOption<Enum>(
  values: Array<Enum | AllOptionEnum>,
): Array<Enum | AllOptionEnum> {
  if (values.length && !values.includes(AllOptionEnum.All)) {
    return values;
  }

  return [AllOptionEnum.All];
}

export function parseZodEnumArray<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(
  parser: Parser,
  cleanerFn: (dirty: z.output<Parser>) => z.output<Parser>,
): (value: string) => z.output<Parser> {
  return (value) => {
    const splut = splitString(value);
    const parsed = parser.parse(splut);
    return cleanerFn(parsed);
  };
}

export function parseZodEnumArrayWithAllOption<
  EnumT extends ZodTypeAny,
  Parser extends ZodArray<EnumT>,
>(parser: Parser): (value: string) => z.output<Parser> {
  return parseZodEnumArray(parser, cleanupEnumArrayWithAllOption);
}
