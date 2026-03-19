import { DateTime } from 'luxon';
import { PagingInfo } from '../../../../types';
import { Priority } from '../../../../types/enums';
import { ChangeHistorySortingInfo } from '../../../common/ChangeHistory';

export type LineChangeHistoryFilters = {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly priority: Priority;
};

export type LineChangeHistoryRouterState = {
  readonly filters: LineChangeHistoryFilters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: ChangeHistorySortingInfo;
};
