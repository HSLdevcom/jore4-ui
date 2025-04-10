import { mapToShortDate, parseDate } from '../../../../time';

export function formatIsoDateString(str: string | null): string | undefined {
  return mapToShortDate(parseDate(str));
}
