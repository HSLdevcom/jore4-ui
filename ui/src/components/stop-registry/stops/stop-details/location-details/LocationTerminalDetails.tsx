import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { StopWithDetails } from '../../../../../types';
import { getMemberStops } from '../../../terminals/components/location-details/LocationDetailsViewCard';
import { getEnrichedParentStopPlace } from '../../../terminals/hooks/useGetTerminalDetails';
import { DetailRow, LabeledDetail } from '../layout';

type LocationTerminalDetailsProps = {
  readonly stop: StopWithDetails;
};

const testIds = {
  terminalLink: 'LocationDetailsViewCard::terminalLink',
  terminalPrivateCode: 'LocationDetailsViewCard::terminalPrivateCode',
  terminalName: 'LocationDetailsViewCard::terminalName',
  terminalStops: 'LocationDetailsViewCard::terminalStops',
};

function getTerminalDetails(stop: StopWithDetails) {
  const terminal = stop.stop_place?.parentStopPlace?.[0];

  const enrichedTerminal =
    // eslint-disable-next-line no-underscore-dangle
    terminal?.__typename === 'stop_registry_ParentStopPlace'
      ? getEnrichedParentStopPlace(terminal)
      : null;

  const memberStopsInfo = enrichedTerminal
    ? getMemberStops(enrichedTerminal)
    : null;
  const memberStops = memberStopsInfo?.memberStops ?? '-';
  const memberStopsTotal = memberStopsInfo?.memberStopsTotal ?? 0;
  const terminalPrivateCode = enrichedTerminal?.privateCode?.value ?? '-';
  const terminalName = enrichedTerminal?.name ?? '-';

  return {
    memberStops,
    memberStopsTotal,
    terminalPrivateCode,
    terminalName,
    hasTerminal: !!enrichedTerminal,
  };
}

export const LocationTerminalDetails: FC<LocationTerminalDetailsProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  const terminalDetails = getTerminalDetails(stop);

  const {
    memberStops,
    memberStopsTotal,
    terminalPrivateCode,
    terminalName,
    hasTerminal,
  } = terminalDetails;

  return (
    <div className="-mx-5 -mt-5 bg-background px-5 py-2.5">
      {/* Has negative margin to stretch grey bg to previous div */}
      <DetailRow>
        {hasTerminal ? (
          <Link
            to={routeDetails[Path.terminalDetails].getLink(terminalPrivateCode)}
            data-testid={testIds.terminalLink}
            title={t('accessibility:terminals.showTerminalDetails', {
              terminalLabel: terminalName,
            })}
          >
            <div className="flex flex-col">
              <div className="text-sm">
                {t('stopDetails.location.terminal')}
              </div>
              <div
                className="text-sm font-bold"
                data-testid={testIds.terminalPrivateCode}
              >
                <span>{terminalPrivateCode}</span>
                <i className="icon-open-in-new ml-1" aria-hidden />
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex flex-col">
            <div className="text-sm">{t('stopDetails.location.terminal')}</div>
            <div
              className="text-sm font-bold"
              data-testid={testIds.terminalPrivateCode}
            >
              <span>-</span>
            </div>
          </div>
        )}
        <LabeledDetail
          title={t('stopDetails.location.terminalName')}
          detail={terminalName}
          testId={testIds.terminalName}
        />

        <LabeledDetail
          title={t('stopDetails.location.terminalStops', {
            total: memberStopsTotal,
          })}
          detail={memberStops}
          testId={testIds.terminalStops}
        />
      </DetailRow>
    </div>
  );
};
