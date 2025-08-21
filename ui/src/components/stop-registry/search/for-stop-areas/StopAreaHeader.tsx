import type { Geometry } from 'geojson';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { Point } from '../../../../types';
import { LocatorButton } from '../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../utils';
import { useShowStopAreaOnMap } from '../../utils';
import { ActionMenu } from './ActionMenu/ActionMenu';
import { OpenDetails } from './ActionMenu/OpenAreaDetailsPage';
import { ShowAreaOnMap } from './ActionMenu/ShowAreaOnMap';
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
  readonly isRounded?: boolean;
};

export const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  className,
  stopArea,
  isRounded,
}) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  const showOnMap = useShowStopAreaOnMap();
  const point = centroidToPoint(stopArea.centroid);

  const onClickAreaMap = point
    ? () => showOnMap(stopArea.netex_id ?? undefined, point)
    : noop;

  return (
    <div
      className={twMerge(
        'flex items-center gap-4 rounded-t-xl border-x border-t border-x-light-grey border-t-light-grey bg-background p-4',
        isRounded ? 'rounded-b-xl border-b border-b-light-grey' : '',
        className,
      )}
    >
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(stopArea.private_code, {
          observationDate,
        })}
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
        onClick={onClickAreaMap}
        tooltipText={t('stopRegistrySearch.showStopAreaOnMap')}
        testId={testIds.locatorButton}
      />

      <ActionMenu>
        <OpenDetails
          key="openDetails"
          className={className}
          privateCode={stopArea.private_code}
          testId={testIds.showStopAreaDetails}
        />
        <ShowAreaOnMap
          key="showOnMap"
          className={className}
          onClick={onClickAreaMap}
          testId={testIds.showOnMap}
        />
      </ActionMenu>
    </div>
  );
};
