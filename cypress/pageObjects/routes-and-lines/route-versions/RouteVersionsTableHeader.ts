import {
  VersionTableColumn,
  createVersionTableHeaderPageObject,
} from '../../common/VersionTableHeaderPageObject';

export type RouteVersionTableColumn = VersionTableColumn;

export const RouteVersionsTableHeader = createVersionTableHeaderPageObject(
  'RouteVersionTableHeaderSortableCell',
);
