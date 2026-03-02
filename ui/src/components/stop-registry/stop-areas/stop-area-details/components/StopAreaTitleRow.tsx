import compact from 'lodash/compact';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { StopRegistryTransportModeType } from '../../../../../generated/graphql';
import { LocatorButton } from '../../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../../utils';
import { PageTitle } from '../../../../common';
import { ObservationDateControl } from '../../../../common/ObservationDateControl';
import { useShowStopAreaOnMap } from '../../../utils';
import { StopAreaComponentProps } from '../types';
import { TitleRowActions } from './TitleRowActions';

const testIds = {
  privateCode: 'StopAreaTitleRow::privateCode',
  name: 'StopAreaTitleRow::name',
  weighting: 'StopAreaTitleRow::weighting',
  locatorButton: 'StopAreaTitleRow::locatorButton',
};

export const StopAreaTitleRow: FC<StopAreaComponentProps> = ({
  area,
  className,
}) => {
  const { t } = useTranslation();

  const showOnMap = useShowStopAreaOnMap();
  const point = mapLngLatToPoint(area.geometry?.coordinates ?? []);

  const onClickAreaMap = point
    ? () => showOnMap(area.id ?? undefined, point)
    : noop;

  const getIconClass = (
    mode: StopRegistryTransportModeType | null | undefined,
  ) => {
    switch (mode) {
      case StopRegistryTransportModeType.Tram:
        return 'icon-tram-filled';
      default:
        return 'icon-bus-alt';
    }
  };

  const getColorClass = (
    mode: StopRegistryTransportModeType | null | undefined,
  ) => {
    switch (mode) {
      case StopRegistryTransportModeType.Tram:
        return 'text-hsl-tram-dark-green';
      default:
        return 'text-tweaked-brand';
    }
  };

  const iconClass = getIconClass(area.transportMode);
  const colorClass = getColorClass(area.transportMode);

  return (
    <div className={twMerge('flex items-center', className)}>
      <i className={twJoin(iconClass, colorClass, 'mr-2 text-3xl')} />
      <PageTitle.H1
        className="mr-2"
        testId={testIds.privateCode}
        titleText={compact([area.privateCode?.value, area.name]).join(' ')}
      >
        {area.privateCode?.value ?? ''}
      </PageTitle.H1>

      <div className="text-xl" data-testid={testIds.name}>
        {area.name ?? null}
      </div>

      <div className="grow" />
      <LocatorButton
        onClick={onClickAreaMap}
        tooltipText={t('stopRegistrySearch.showStopAreaOnMap')}
        testId={testIds.locatorButton}
        className="mt-5 mr-2"
      />
      <TitleRowActions
        className="mt-5 mr-4"
        area={area}
        showOnMap={onClickAreaMap}
      />
      <ObservationDateControl containerClassName="w-1/6" />
    </div>
  );
};
