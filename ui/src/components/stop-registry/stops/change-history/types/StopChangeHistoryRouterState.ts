import { DateTime } from 'luxon';
import { PagingInfo } from '../../../../../types';
import { Priority } from '../../../../../types/enums';
import { ChangeHistorySortingInfo } from '../../../../common/ChangeHistory';

export type StopChangeHistoryFilters = {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly priority: Priority;
};

export type StopChangeHistoryRouterState = {
  readonly filters: StopChangeHistoryFilters;
  readonly pagingInfo: PagingInfo;
  readonly sortingInfo: ChangeHistorySortingInfo;
};
