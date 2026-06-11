import groupBy from 'lodash/groupBy';
import { FC, useMemo } from 'react';
import { RouteVersion } from '../types';
import { DraftVersionsContainer } from './DraftVersionsContainer';
import { ScheduledVersionsContainer } from './ScheduledVersionsContainer';

const emptyList: ReadonlyArray<RouteVersion> = [];

type RouteVersionContainersProps = {
  readonly routeVersions: ReadonlyArray<RouteVersion> | null;
};

export const RouteVersionContainers: FC<RouteVersionContainersProps> = ({
  routeVersions,
}) => {
  const { scheduled = emptyList, drafts = emptyList } = useMemo(
    () =>
      groupBy(routeVersions ?? [], (it) =>
        it.status !== 'DRAFT' ? 'scheduled' : 'drafts',
      ),
    [routeVersions],
  );

  return (
    <>
      <ScheduledVersionsContainer className="mt-8" routeVersions={scheduled} />

      <DraftVersionsContainer className="mt-8" routeVersions={drafts} />
    </>
  );
};
