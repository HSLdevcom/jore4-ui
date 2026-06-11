import { Dispatch, FC, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import {
  NoVersionRow,
  VersionTableSortingInfo,
} from '../../../common/versions';
import { VersionTableHeader } from '../../../common/versions/VersionTableHeader';
import { RouteVersion } from '../types';
import { RouteVersionRow } from './RouteVersionRow';

type RouteVersionTableProps = {
  readonly className?: string;
  readonly routeVersions: ReadonlyArray<RouteVersion>;
  readonly sortingInfo: VersionTableSortingInfo;
  readonly setSortingInfo: Dispatch<SetStateAction<VersionTableSortingInfo>>;
  readonly testId: string;
  readonly noVersionsText: string;
};

export const RouteVersionTable: FC<RouteVersionTableProps> = ({
  className,
  routeVersions,
  sortingInfo,
  setSortingInfo,
  testId,
  noVersionsText,
}) => {
  return (
    <table
      className={twMerge('border-light-grey', className)}
      data-testid={testId}
    >
      <VersionTableHeader
        className="border-b"
        sortingInfo={sortingInfo}
        setSortingInfo={setSortingInfo}
        testIdPrefix="RouteVersionTableHeaderSortableCell"
      />

      <tbody>
        {routeVersions.length ? (
          routeVersions.map((routeVersion) => (
            <RouteVersionRow
              key={routeVersion.id}
              routeVersion={routeVersion}
            />
          ))
        ) : (
          <NoVersionRow noVersionsText={noVersionsText} colSpan={9} />
        )}
      </tbody>
    </table>
  );
};
