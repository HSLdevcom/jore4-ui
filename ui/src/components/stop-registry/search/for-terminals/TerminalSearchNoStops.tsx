import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOpenInNew } from 'react-icons/md';
import { Link } from 'react-router';
import { useObservationDateQueryParam } from '../../../../hooks';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { FindStopPlaceInfo } from '../components/StopPlaceSharedComponents/useFindStopPlaces';

const testIds = {
  noStopsInTerminal: 'TerminalSearch:noStopsText',
  terminalLink: 'StopPlaceSearch::noStopsLink',
};

type TerminalSearchNoStopsProps = {
  readonly stopPlace: FindStopPlaceInfo;
};

export const TerminalSearchNoStops: FC<TerminalSearchNoStopsProps> = ({
  stopPlace: terminal,
}) => {
  const { t } = useTranslation();

  const { observationDate } = useObservationDateQueryParam({
    initialize: false,
  });

  return (
    <div
      className="mt-4 ml-2 flex w-full flex-row items-center gap-1"
      data-testid={testIds.noStopsInTerminal}
    >
      <i className="icon-info text-2xl text-brand" />
      <p>{t('terminalDetails.noStops')}</p>
      <Link
        to={routeDetails[Path.terminalDetails].getLink(terminal.private_code, {
          observationDate,
        })}
        data-testid={testIds.terminalLink}
        title={t('accessibility:terminals.showTerminalDetails', {
          terminalLabel: terminal.name_value,
        })}
        className="flex flex-row items-center gap-1 font-bold"
      >
        <span>{t('stopRegistrySearch.goToTerminalDetails')}</span>
        <MdOpenInNew />
      </Link>
    </div>
  );
};
