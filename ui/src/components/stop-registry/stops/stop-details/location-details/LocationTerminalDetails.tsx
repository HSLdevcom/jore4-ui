import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { StopWithDetails } from '../../../../../types';
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

export const LocationTerminalDetails: FC<LocationTerminalDetailsProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <div className="-mx-5 -mt-5 bg-background px-5 py-2.5">
      {/* Has negative margin to stretch grey bg to previous div */}
      <DetailRow>
        <Link
          to={routeDetails[Path.terminalDetails].getLink(stop.stop_place?.id)}
          data-testid={testIds.terminalLink}
          title={t('accessibility:terminals.showTerminalDetails', {
            terminalLabel: stop.stop_place?.name,
          })}
        >
          <div className="flex flex-col">
            <div className="text-sm">{t('stopDetails.location.terminal')}</div>
            <div
              className="text-sm font-bold"
              data-testid={testIds.terminalPrivateCode}
            >
              <span>{stop.stop_place?.privateCode?.value}</span>
              <i className="icon-open-in-new ml-1" aria-hidden="true" />
            </div>
          </div>
        </Link>
        <LabeledDetail
          title={t('stopDetails.location.terminalName')}
          detail={null /* TODO */}
          testId={testIds.terminalName}
        />
        <LabeledDetail
          title={t('stopDetails.location.terminalStops')}
          detail={null /* TODO */}
          testId={testIds.terminalStops}
        />
      </DetailRow>
    </div>
  );
};
