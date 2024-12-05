import { FC } from 'react';
import { StopWithDetails } from '../../../../hooks';
import { ExtraActions } from './ExtraActions';

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
      <h2 className="mr-2 font-bold" data-testid={testIds.label}>
        {label}
      </h2>
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

      <ExtraActions stop={stopDetails} />
    </div>
  );
};
