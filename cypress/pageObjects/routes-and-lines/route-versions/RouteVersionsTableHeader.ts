import { VersionTableHeaderBase } from '../../common/VersionTableHeaderPageObject';

class RouteVersionsTableHeaderImpl extends VersionTableHeaderBase {
  protected headerTestIdPrefix = 'RouteVersionTableHeaderSortableCell';
}

export const RouteVersionsTableHeader = new RouteVersionsTableHeaderImpl();
