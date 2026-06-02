import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  NoVersionRow,
  VersionTableSortingInfo,
} from '../../../../common/versions';
import { StopVersion } from '../types';
import { StopVersionRow } from './StopVersionRow';
import { StopVersionTableHeader } from './StopVersionTableHeader';

type StopVersionTableProps = {
  readonly className?: string;
  readonly noVersionsText: string;
  readonly publicCode: string;
  readonly stopVersions: ReadonlyArray<StopVersion>;
  readonly sortingInfo: VersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<VersionTableSortingInfo>>;
  readonly testId: string;
};

export const StopVersionTable: FC<StopVersionTableProps> = ({
  className,
  noVersionsText,
  publicCode,
  stopVersions,
  sortingInfo,
  setSortingInfo,
  testId,
}) => {
  return (
    <table
      className={twMerge('border-light-grey', className)}
      data-testid={testId}
    >
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
          <NoVersionRow noVersionsText={noVersionsText} colSpan={9} />
        )}
      </tbody>
    </table>
  );
};
