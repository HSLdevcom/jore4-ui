import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { StopAreaComponentProps } from './StopAreaComponentProps';

const testIds = {
  description: 'StopAreaDetailsPage::StopAreaTitleRow::description',
  name: 'StopAreaDetailsPage::StopAreaTitleRow::name',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => (
  <div className={twMerge('flex items-center', className)}>
    <i className="icon-bus-alt mr-2 text-3xl text-tweaked-brand" />
    <h2 className="mr-2 font-bold" data-testid={testIds.name}>
      {area.name?.value ?? null}
    </h2>

    <div className="text-xl" data-testid={testIds.description}>
      {area.description?.value ?? null}
    </div>

    <div className="flex-grow" />

    <ObservationDateControl containerClassName="w-1/6" />
  </div>
);
