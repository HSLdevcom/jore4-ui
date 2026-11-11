import { SortOrder } from '../../../../types';
import { SearchPageSortingInfo } from '../../../common/Search/SearchPageRouterState';
import { SortStopsBy } from './SortStopsBy';

export type SortingInfo = SearchPageSortingInfo<SortStopsBy>;

export const defaultSortingInfo: SortingInfo = {
  sortBy: SortStopsBy.DEFAULT,
  sortOrder: SortOrder.ASCENDING,
};
