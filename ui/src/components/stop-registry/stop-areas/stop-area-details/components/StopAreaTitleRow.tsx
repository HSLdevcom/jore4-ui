import compact from 'lodash/compact';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { PageTitle } from '../../../../common';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  privateCode: 'StopAreaTitleRow::privateCode',
  name: 'StopAreaTitleRow::name',
  weighting: 'StopAreaTitleRow::weighting',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => {
  return (
    <div className={twMerge('flex items-center', className)}>
      <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
      <PageTitle.H1
        className="mr-2"
        testId={testIds.name}
        titleText={compact([area.name, area.privateCode?.value]).join(' ')}
      >
        {area.privateCode?.value ?? ''}
      </PageTitle.H1>

      <div className="text-xl" data-testid={testIds.name}>
        {area.name ?? null}
      </div>

      <div className="flex-grow" />

      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
};
