import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { Row } from '../../../../common/LayoutComponents';
import { StopTransportModeIcon } from '../../StopTransportModeIcon';
import { StopSearchRow } from '../types';

type StopLabelLinkProps = {
  readonly observationDate: Temporal.PlainDate;
  readonly stop: StopSearchRow;
};

const testIds = {
  link: 'StopTableRow::link',
};

export const StopLabelLink: FC<StopLabelLinkProps> = ({
  observationDate,
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="items-center leading-none font-bold">
      {stop.transportModes.map((mode) => (
        <StopTransportModeIcon
          key={mode}
          className="mx-2 text-xl not-last-of-type:-mr-1"
          mode={mode}
          active={stop.activeTransportModes.includes(mode)}
          trunkLine={stop.trunkLineStop}
          speedTram={stop.speedTramStop}
        />
      ))}

      <Link
        className="ml-1"
        to={routeDetails[Path.stopDetails].getLink(stop.publicCode, {
          observationDate,
          priority: stop.priority,
        })}
        data-testid={testIds.link}
        title={t(($) => $.accessibility.stops.showStopDetails, {
          stopLabel: stop.publicCode,
        })}
      >
        <h2>{stop.publicCode}</h2>
      </Link>
    </Row>
  );
};
