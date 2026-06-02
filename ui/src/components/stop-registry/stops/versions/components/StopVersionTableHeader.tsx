import { Dispatch, FC, SetStateAction } from 'react';
import {
  EmptyColumnHeader,
  VersionTableHeaderSortableCell,
  VersionTableSortingInfo,
} from '../../../../common/versions';

type StopVersionTableHeaderProps = {
  readonly className?: string;
  readonly sortingInfo: VersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<VersionTableSortingInfo>>;
};

export const StopVersionTableHeader: FC<StopVersionTableHeaderProps> = ({
  className,
  sortingInfo,
  setSortingInfo,
}) => {
  return (
    <thead className={className}>
      <tr className="text-nowrap">
        <VersionTableHeaderSortableCell
          className="mr-auto px-4 py-2"
          columnType="STATUS"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <VersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_START"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <EmptyColumnHeader className="w-fit" />

        <VersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_END"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <VersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          tdClassName="w-full"
          columnType="VERSION_COMMENT"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <VersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          columnType="CHANGED"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <VersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          columnType="CHANGED_BY"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          testIdPrefix="StopVersionTableHeaderSortableCell"
        />

        <EmptyColumnHeader />
        <EmptyColumnHeader />
      </tr>
    </thead>
  );
};
