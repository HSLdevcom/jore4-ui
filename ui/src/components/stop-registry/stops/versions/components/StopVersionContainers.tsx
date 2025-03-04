import groupBy from 'lodash/groupBy';
import { FC, useMemo } from 'react';
import { StopVersion } from '../types';
import { DraftVersionsContainer } from './DraftVersionsContainer';
import { ScheduledVersionsContainer } from './ScheduledVersionsContainer';

const emptyList: ReadonlyArray<StopVersion> = [];

type StopVersionContainersProps = {
  readonly publicCode: string;
  readonly stopVersions: ReadonlyArray<StopVersion> | null;
};

export const StopVersionContainers: FC<StopVersionContainersProps> = ({
  publicCode,
  stopVersions,
}) => {
  const { scheduled = emptyList, drafts = emptyList } = useMemo(
    () =>
      groupBy(stopVersions ?? [], (it) =>
        it.status !== 'DRAFT' ? 'scheduled' : 'drafts',
      ),
    [stopVersions],
  );

  return (
    <>
      <ScheduledVersionsContainer
        className="mt-8"
        publicCode={publicCode}
        stopVersions={scheduled}
      />

      <DraftVersionsContainer
        className="mt-8"
        publicCode={publicCode}
        stopVersions={drafts}
      />
    </>
  );
};
