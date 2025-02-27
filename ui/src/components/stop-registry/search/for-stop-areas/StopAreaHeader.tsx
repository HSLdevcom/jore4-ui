import { Geometry } from 'geojson';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { Point } from '../../../../types';
import { LocatorButton } from '../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../utils';
import { ActionMenu } from '../../components/ActionMenu';
import { OpenDetails } from '../../components/MenuItems/OpenAreaDetailsPage';
import { ShowAreaOnMap } from '../../components/MenuItems/ShowAreaOnMap';
import { useShowStopAreaOnMap } from '../../utils';
import { FindStopAreaInfo } from './useFindStopAreas';

const testIds = {
  stopAreaLabel: 'StopAreaSearch::label',
  stopAreaLink: 'StopAreaSearch::link',
  locatorButton: 'StopAreaSearch::locatorButton',
  showOnMap: 'StopAreaSearch::showOnMap',
  showStopAreaDetails: 'StopAreaSearch::showStopAreaDetails',
};

function centroidToPoint(centroid: Geometry | null | undefined): Point | null {
  if (centroid?.type === 'Point') {
    return mapLngLatToPoint(centroid.coordinates);
  }

  return null;
}

type StopAreaHeaderProps = {
  readonly className?: string;
  readonly stopArea: FindStopAreaInfo;
};

export const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  className,
  stopArea,
}) => {
  const { t } = useTranslation();

  const showOnMap = useShowStopAreaOnMap();
  const point = centroidToPoint(stopArea.centroid);

  return (
    <div
      className={twMerge(
        'flex items-center gap-4 rounded-t-xl border-x border-t border-x-light-grey border-t-light-grey bg-background p-4',
        className,
      )}
    >
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(stopArea.netex_id)}
        data-testid={testIds.stopAreaLink}
        title={t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: stopArea.name_value,
        })}
      >
        <h3 data-testid={testIds.stopAreaLabel}>
          {t('stopRegistrySearch.stopAreaLabel', {
            privateCode: stopArea.private_code,
            name: stopArea.name_value,
          })}
        </h3>
      </Link>

      <div className="flex-grow" />

      <LocatorButton
        onClick={
          point ? () => showOnMap(stopArea.netex_id ?? undefined, point) : noop
        }
        tooltipText={t('stopRegistrySearch.showStopAreaOnMap')}
        testId={testIds.locatorButton}
      />

      <ActionMenu
        className="w-auto py-3 pr-8"
        menuItems={[
          <OpenDetails
            key="openDetails"
            className={className}
            netexId={stopArea.netex_id}
            testId={testIds.showStopAreaDetails}
          />,
          <ShowAreaOnMap
            key="showOnMap"
            className={className}
            netexId={stopArea.netex_id}
            point={point}
            showOnMap={showOnMap}
            testId={testIds.showOnMap}
          />
        ]}
      />
    </div>
  );
};
