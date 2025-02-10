import compact from 'lodash/compact';
import { FC } from 'react';
import { StopWithDetails } from '../../../../../hooks';
import { PageTitle } from '../../../../common';
import { EditValidityButton } from './EditValidityButton';
import { ExtraActions } from './ExtraActions';
import { OpenOnMapButton } from './OpenOnMapButton';

const testIds = {
  label: 'StopTitleRow::label',
  names: 'StopTitleRow::names',
};

type StopTitleRowProps = {
  readonly stopDetails: StopWithDetails | null;
  readonly label: string;
};

export const StopTitleRow: FC<StopTitleRowProps> = ({ stopDetails, label }) => {
  return (
    <div className="flex items-center">
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <PageTitle.H1
        className="mr-2"
        testId={testIds.label}
        titleText={compact([label, stopDetails?.stop_place?.nameFin]).join(' ')}
      >
        {label}
      </PageTitle.H1>
      <div className="text-xl" data-testid={testIds.names}>
        <span>
          {
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            stopDetails?.stop_place?.nameFin || '-'
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

      <div className="flex-grow" />

      <EditValidityButton stop={stopDetails} />
      <OpenOnMapButton className="ml-2" label={label} stop={stopDetails} />
      <ExtraActions className="ml-2" stop={stopDetails} />
    </div>
  );
};
