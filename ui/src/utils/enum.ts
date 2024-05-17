// eslint-disable-next-line @typescript-eslint/ban-types
export function getEnumValues(inputEnum: Object): string[] {
  return Object.values(inputEnum).filter(
    (value) => typeof value === 'string',
  ) as string[];
}

/** This enum is used to add the 'All' option to enumDropdowns and also having
 * the correct types on searchConditions
 */
export enum AllOptionEnum {
  All = 'all',
}

/** This enum is used to add the null option to enumDropdowns.
 */
export enum NullOptionEnum {
  Null = 'null',
}

/** Enum for different search result options */
export enum DisplayedSearchResultType {
  Routes = 'routes',
  Lines = 'lines',
}
