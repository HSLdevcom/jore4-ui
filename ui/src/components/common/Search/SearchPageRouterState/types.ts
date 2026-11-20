import { PagingInfo, SortOrder } from '../../../../types';
import { ResultSelectionHistoryState } from '../ResultSelection';

export type SearchPageSortingInfo<SortBy extends string> = {
  readonly sortBy: SortBy;
  readonly sortOrder: SortOrder;
};

export type FiltersShape = Readonly<Record<string, unknown>>;

export type SearchPageUrlFlatState<
  Filters extends FiltersShape,
  SortBy extends string,
> = Filters & PagingInfo & SearchPageSortingInfo<SortBy>;

export type SearchPageSearchState<
  Filters extends FiltersShape,
  SortBy extends string,
> = {
  readonly filters: Filters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: SearchPageSortingInfo<SortBy>;
};

export type SearchPageHistoryState = ResultSelectionHistoryState & {
  readonly searchIsExpanded: boolean;
};
