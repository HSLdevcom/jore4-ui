import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { LocatorButton } from '../../../../uiComponents';
import { useShowStopAreaOnMap } from '../../utils';
import { ActionMenu } from '../components/StopPlaceSharedComponents/ActionMenu/ActionMenu';
import { OpenDetails } from '../components/StopPlaceSharedComponents/ActionMenu/OpenDetailsPage';
import { ShowOnMap } from '../components/StopPlaceSharedComponents/ActionMenu/ShowOnMap';
import { FindStopPlaceInfo } from '../components/StopPlaceSharedComponents/useFindStopPlaces';
import { centroidToPoint } from '../utils/centroidToPoint';

const testIds = {
  stopAreaLabel: 'StopAreaSearch::label',
  stopAreaLink: 'StopAreaSearch::link',
  locatorButton: 'StopAreaSearch::locatorButton',
  showOnMap: 'StopAreaSearch::showOnMap',
  showStopAreaDetails: 'StopAreaSearch::showStopAreaDetails',
};

type StopAreaHeaderProps = {
  readonly className?: string;
  readonly stopPlace: FindStopPlaceInfo;
  readonly isRounded: boolean;
};

export const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  className,
  stopPlace: stopArea,
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
          text={t('stopRegistrySearch.stopAreaRowActions.openDetails')}
          details={Path.stopAreaDetails}
        />
        <ShowOnMap
          key="showOnMap"
          className={className}
          onClick={onClickAreaMap}
          testId={testIds.showOnMap}
          text={t('stopRegistrySearch.stopAreaRowActions.showOnMap')}
        />
      </ActionMenu>
    </div>
  );
};
