import {
  VersionTableColumn,
  createVersionTableHeaderPageObject,
} from '../../common/VersionTableHeaderPageObject';

export type StopVersionTableColumn = VersionTableColumn;

export const StopVersionsTableHeader = createVersionTableHeaderPageObject(
  'StopVersionTableHeaderSortableCell',
);
