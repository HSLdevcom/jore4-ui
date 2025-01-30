import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { PageTitle } from '../../../../common';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  description: 'StopAreaTitleRow::description',
  name: 'StopAreaTitleRow::name',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => (
  <div className={twMerge('flex items-center', className)}>
    <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
    <PageTitle.H1 className="mr-2" testId={testIds.name}>
      {area.name?.value ?? ''}
    </PageTitle.H1>

    <div className="text-xl" data-testid={testIds.description}>
      {area.description?.value ?? null}
    </div>

    <div className="flex-grow" />

    <ObservationDateControl containerClassName="w-1/6" />
  </div>
);
