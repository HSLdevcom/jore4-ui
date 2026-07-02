import { Dispatch, FC, SetStateAction } from 'react';
import { EmptyColumnHeader } from './EmptyColumnHeader';
import { VersionTableSortingInfo } from './useVersionContainerControls';
import { VersionTableHeaderSortableCell } from './VersionTableHeaderSortableCell';

type VersionTableHeaderProps = {
  readonly className?: string;
  readonly sortingInfo: VersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<VersionTableSortingInfo>>;
  readonly testIdPrefix?: string;
};

export const VersionTableHeader: FC<VersionTableHeaderProps> = ({
  className,
  sortingInfo,
  setSortingInfo,
  testIdPrefix,
}) => {
  return (
    <thead className={className}>
      <tr className="text-nowrap">
        <VersionTableHeaderSortableCell
          className="mr-auto px-4 py-2"
          columnType="STATUS"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <VersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_START"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <EmptyColumnHeader className="w-fit" />

        <VersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_END"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <VersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          tdClassName="w-full"
          columnType="VERSION_COMMENT"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <VersionTableHeaderSortableCell
          className="mr-auto px-4 py-2"
          columnType="CHANGED"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <VersionTableHeaderSortableCell
          className="mr-auto px-4 py-2"
          columnType="CHANGED_BY"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix={testIdPrefix}
        />

        <EmptyColumnHeader className="w-fit" />
        <EmptyColumnHeader className="w-fit" />
      </tr>
    </thead>
  );
};
