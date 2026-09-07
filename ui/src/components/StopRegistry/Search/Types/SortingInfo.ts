import { SortOrder } from '../../../../types';
import { SortStopsBy } from './SortStopsBy';

export type SortingInfo = {
  readonly sortBy: SortStopsBy;
  readonly sortOrder: SortOrder;
};

export const defaultSortingInfo: SortingInfo = {
  sortBy: SortStopsBy.DEFAULT,
  sortOrder: SortOrder.ASCENDING,
};
