import compact from 'lodash/compact';
import sortBy from 'lodash/sortBy';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../../hooks';
import { StopWithDetails } from '../../../../../types';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { PageTitle } from '../../../../common';
import { StopTransportModeIcon } from '../../../components';
import { getEffectiveStopState } from '../getEffectiveStopState';
import { MirroredQuayDetails } from '../useGetStopDetails';
import { ExtraActions } from './ExtraActions';
import { OpenOnMapButton } from './OpenOnMapButton';
import { StopTimetablesButton } from './StopTimetablesButton';

const testIds = {
  label: 'StopTitleRow::label',
  names: 'StopTitleRow::names',
};

type ModeStatus = {
  readonly mode: StopRegistryTransportModeType | null;
  readonly active: boolean;
  readonly trunkLine: boolean;
  readonly speedTram: boolean;
};

function getModeStatus(
  stop: MirroredQuayDetails | StopWithDetails,
  observationDate: DateTime,
): ModeStatus {
  const stopPlace = 'stopPlace' in stop ? stop.stopPlace : stop.stop_place;

  const effectiveState = getEffectiveStopState(
    stop.quay?.stopState,
    stop.quay?.stopStateValidityStart,
    stop.quay?.stopStateValidityEnd,
    observationDate,
  );

  return {
    mode: stopPlace?.transportMode ?? null,
    active: effectiveState === StopPlaceState.InOperation,
    trunkLine: !!stop.quay?.stopType.trunkLineStop,
    speedTram: !!stop.quay?.stopType.speedTramStop,
  };
}

function resolveModes(
  stopDetails: StopWithDetails | null,
  mirroredQuays: ReadonlyArray<MirroredQuayDetails>,
  observationDate: DateTime,
): Array<ModeStatus> {
  if (!stopDetails) {
    return [];
  }

  return sortBy(
    [
      getModeStatus(stopDetails, observationDate),
      ...mirroredQuays.map((q) => getModeStatus(q, observationDate)),
    ],
    (status) => status.mode,
  );
}

type StopTitleRowProps = {
  readonly stopDetails: StopWithDetails | null;
  readonly label: string;
  readonly mirroredQuays: ReadonlyArray<MirroredQuayDetails>;
};

export const StopTitleRow: FC<StopTitleRowProps> = ({
  stopDetails,
  label,
  mirroredQuays,
}) => {
  const { observationDate } = useObservationDateQueryParam();

  return (
    <div className="flex items-center gap-2">
      {resolveModes(stopDetails, mirroredQuays, observationDate).map(
        ({ mode, active, trunkLine, speedTram }) => (
          <StopTransportModeIcon
            key={mode}
            className="text-3xl"
            mode={mode}
            active={active}
            trunkLine={trunkLine}
            speedTram={speedTram}
          />
        ),
      )}
      <PageTitle.H1
        className="mr-2"
        testId={testIds.label}
        titleText={compact([label, stopDetails?.stop_place?.name]).join(' ')}
      >
        {label}
      </PageTitle.H1>
      <div className="text-xl" data-testid={testIds.names}>
        <span>
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            stopDetails?.stop_place?.name || '-'
          }
        </span>
        <span className="mx-2">|</span>
        <span>
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            stopDetails?.stop_place?.nameSwe || '-'
          }
        </span>
      </div>

      <div className="grow" />

      <StopTimetablesButton />
      <OpenOnMapButton label={label} stop={stopDetails} />
      <ExtraActions stop={stopDetails} />
    </div>
  );
};
