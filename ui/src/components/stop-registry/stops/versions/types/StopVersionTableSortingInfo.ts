import { SortOrder } from '../../../../../types';
import { StopVersionTableColumn } from './StopVersionTableColumn';

export type StopVersionTableSortingInfo = {
  readonly sortBy: StopVersionTableColumn;
  readonly sortOrder: SortOrder;
};
