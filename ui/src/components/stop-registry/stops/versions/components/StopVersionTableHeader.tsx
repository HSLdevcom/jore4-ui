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
      <tr className="text-nowrap *:px-4 *:py-2">
        <StopVersionTableHeaderSortableCell
          className="mr-auto"
          columnType="STATUS"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="ml-auto"
          columnType="VALIDITY_START"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <EmptyColumnHeader className="w-fit !p-0" />

        <StopVersionTableHeaderSortableCell
          className="ml-auto"
          columnType="VALIDITY_END"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto"
          tdClassName="w-full"
          columnType="VERSION_COMMENT"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto"
          columnType="CHANGED"
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
        />

        <StopVersionTableHeaderSortableCell
          className="mx-auto"
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
