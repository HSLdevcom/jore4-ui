import { VersionTableHeaderBase } from '../../common/VersionTableHeaderPageObject';

class StopVersionsTableHeaderImpl extends VersionTableHeaderBase {
  protected headerTestIdPrefix = 'StopVersionTableHeaderSortableCell';
}

export const StopVersionsTableHeader = new StopVersionsTableHeaderImpl();
