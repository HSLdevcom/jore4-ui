import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { FindStopPlaceInfo } from '../components/StopPlaceSharedComponents/useFindStopPlaces';

const testIds = {
  noStopsInStopArea: 'StopAreaSearch:noStopsText',
  stopAreaLink: 'StopPlaceSearch::noStopsLink',
};

type StopAreaSearchNoStopsProps = {
  readonly className?: string;
  readonly stopPlace: FindStopPlaceInfo;
};

export const StopAreaSearchNoStops: FC<StopAreaSearchNoStopsProps> = ({
  className,
  stopPlace: stopArea,
}) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  return (
    <div
      className={twMerge(
        'ml-2 flex flex-row items-center gap-1 rounded-b-xl border-x border-b border-x-light-grey border-b-light-grey p-4',
        className,
      )}
      data-testid={testIds.noStopsInStopArea}
    >
      <i className="icon-info ml-[-0.2em] text-2xl text-brand" />
      <p>{t('stopArea.noStops')}</p>
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(stopArea.private_code, {
          observationDate,
        })}
        data-testid={testIds.stopAreaLink}
        title={t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: stopArea.name_value,
        })}
        className="flex flex-row items-center gap-1 font-bold"
      >
        <span>{t('stopRegistrySearch.goToStopAreaDetails')}</span>
        <MdOpenInNew />
      </Link>
    </div>
  );
};
