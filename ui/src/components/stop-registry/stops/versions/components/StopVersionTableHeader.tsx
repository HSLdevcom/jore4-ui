import { Dispatch, FC, SetStateAction } from 'react';
import { StopVersionTableSortingInfo } from '../types';
import { StopVersionTableHeaderSortableCell } from './StopVersionTableHeaderSortableCell';

const EmptyColumnHeader: FC<{ readonly className?: string }> = ({
  className,
}) => (
  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  <td className={className} />
);

type StopVersionTableHeaderProps = {
  readonly className?: string;
  readonly sortingInfo: StopVersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<
    SetStateAction<StopVersionTableSortingInfo>
  >;
};

export const StopVersionTableHeader: FC<StopVersionTableHeaderProps> = ({
  className,
  sortingInfo,
  setSortingInfo,
}) => {
  return (
    <thead className={className}>
      <tr className="text-nowrap">
        <StopVersionTableHeaderSortableCell
          className="mr-auto px-4 py-2"
          columnType="STATUS"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_START"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <EmptyColumnHeader className="w-fit" />

        <StopVersionTableHeaderSortableCell
          className="ml-auto px-4 py-2"
          columnType="VALIDITY_END"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          tdClassName="w-full"
          columnType="VERSION_COMMENT"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          columnType="CHANGED"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto px-4 py-2"
          columnType="CHANGED_BY"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <EmptyColumnHeader />
        <EmptyColumnHeader />
      </tr>
    </thead>
  );
};
