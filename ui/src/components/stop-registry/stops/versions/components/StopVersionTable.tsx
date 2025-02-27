import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopVersion, StopVersionTableSortingInfo } from '../types';
import { NoVersionRow } from './NoVersionRow';
import { StopVersionRow } from './StopVersionRow';
import { StopVersionTableHeader } from './StopVersionTableHeader';

type StopVersionTableProps = {
  readonly className?: string;
  readonly noVersionsText: string;
  readonly publicCode: string;
  readonly stopVersions: ReadonlyArray<StopVersion>;
  readonly sortingInfo: StopVersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<
    SetStateAction<StopVersionTableSortingInfo>
  >;
};

export const StopVersionTable: FC<StopVersionTableProps> = ({
  className,
  noVersionsText,
  publicCode,
  stopVersions,
  sortingInfo,
  setSortingInfo,
}) => {
  return (
    <table className={twMerge('h-1 w-full border-light-grey', className)}>
      <StopVersionTableHeader
        className="border-b"
        sortingInfo={sortingInfo}
        setSortingInfo={setSortingInfo}
      />

      <tbody>
        {stopVersions.length ? (
          stopVersions.map((stopVersion) => (
            <StopVersionRow
              key={stopVersion.id}
              publicCode={publicCode}
              stopVersion={stopVersion}
            />
          ))
        ) : (
          <NoVersionRow noVersionsText={noVersionsText} />
        )}
      </tbody>
    </table>
  );
};
