import compact from 'lodash/compact';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { getTransportModeIcon, mapLngLatToPoint } from '../../../../../utils';
import { LocatorButton } from '../../../../common/Buttons';
import { ObservationDateControl, PageTitle } from '../../../../common/Jore';
import { useShowStopAreaOnMap } from '../../../utils';
import { StopAreaComponentProps } from '../Types';
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
    ? () => showOnMap(area.id ?? undefined, point, area.transportMode)
    : noop;

  const transportModeIcon = getTransportModeIcon(area.transportMode);

  return (
    <div className={twMerge('flex items-center', className)}>
      <i className={twJoin(transportModeIcon, 'mr-3 text-3xl')} />
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
        tooltipText={t(($) => $.stopRegistrySearch.showStopAreaOnMap)}
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
