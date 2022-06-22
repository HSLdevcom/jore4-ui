// eslint-disable-next-line @typescript-eslint/ban-types
export function getEnumValues(inputEnum: Object): string[] {
  return Object.values(inputEnum).filter(
    (value) => typeof value === 'string',
  ) as string[];
}
