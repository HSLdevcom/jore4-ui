import { ChangeHistoryFilters } from '../../common/ChangeHistory';
import { BaseTiamatChangeHistoryItem } from '../types';

export function filterTiamatHistoryItems({
  from,
  to,
}: ChangeHistoryFilters): (item: BaseTiamatChangeHistoryItem) => boolean {
  const fromStr = from.startOf('day').toUTC().toISO({ includeOffset: false });
  const toStr = to.endOf('day').toUTC().toISO({ includeOffset: false });

  // Changed is a ISO 8601 date-time string and be compared as string.
  return (item) =>
    !!item.changed && fromStr <= item.changed && item.changed <= toStr;
}
