import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { Link } from 'react-router';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { FindStopAreaInfo } from './useFindStopAreas';

const testIds = {
  noStopsInStopArea: 'StopAreaSearch:noStopsText',
  stopAreaLink: 'StopAreaSearch::noStopsLink',
};

type StopAreaSearchNoStopsProps = {
  readonly stopArea: FindStopAreaInfo;
};

export const StopAreaSearchNoStops: FC<StopAreaSearchNoStopsProps> = ({
  stopArea,
}) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  return (
    <div
      className="ml-2 mt-4 flex w-full flex-row items-center gap-1"
      data-testid={testIds.noStopsInStopArea}
    >
      <i className="icon-info text-2xl text-brand" />
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
