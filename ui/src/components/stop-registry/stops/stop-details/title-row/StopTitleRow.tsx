import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import { PageTitle } from '../../../../common';
import { getTransportModeIcon } from '../../../utils/getTransportModeIcon';
import { ExtraActions } from './ExtraActions';
import { OpenOnMapButton } from './OpenOnMapButton';
import { StopTimetablesButton } from './StopTimetablesButton';

const testIds = {
  label: 'StopTitleRow::label',
  names: 'StopTitleRow::names',
};

type StopTitleRowProps = {
  readonly stopDetails: StopWithDetails | null;
  readonly label: string;
  readonly mirroredTransportModes?: ReadonlyArray<StopRegistryTransportModeType>;
};

export const StopTitleRow: FC<StopTitleRowProps> = ({
  stopDetails,
  label,
  mirroredTransportModes = [],
}) => {
  const ownMode = stopDetails?.stop_place?.transportMode;
  const allModes = uniq(compact([ownMode, ...mirroredTransportModes]));

  return (
    <div className="flex items-center gap-2">
      {allModes.length > 0 ? (
        allModes.map((mode) => (
          <i
            key={mode}
            className={twJoin(getTransportModeIcon(mode), 'text-3xl')}
          />
        ))
      ) : (
        <i className="icon-bus-alt text-3xl text-tweaked-brand" />
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
