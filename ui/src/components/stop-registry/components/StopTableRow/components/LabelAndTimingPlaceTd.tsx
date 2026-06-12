import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twJoin } from 'tailwind-merge';
import { mapStopRegistryTransportModeTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { Row } from '../../../../../layoutComponents';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { getTransportModeIcon } from '../../../utils/getTransportModeIcon';
import { StopRowTdProps } from '../types';

const testIds = {
  link: 'StopTableRow::link',
};

type LabelAndTimingPlaceTdProps = StopRowTdProps & {
  readonly observationDate: DateTime;
};

export const LabelAndTimingPlaceTd: FC<LabelAndTimingPlaceTdProps> = ({
  className,
  observationDate,
  stop,
}) => {
  const { t } = useTranslation();

  return (
    <td className={className}>
      <Row className="items-center leading-none font-bold">
        {stop.transportModes.map((mode) => (
          <i
            key={mode}
            className={twJoin(
              getTransportModeIcon(
                mode,
                stop.activeTransportModes.includes(mode),
                stop.trunkLineStop,
                stop.speedTramStop,
              ),
              'text-xl not-last-of-type:-mr-1',
            )}
            title={mapStopRegistryTransportModeTypeToUiName(t, mode)}
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
      {stop.timingPlace && (
        <Row className="mt-2 items-center">
          <span
            className="h-4 text-sm leading-none"
            title={t(($) => $.accessibility.stops.timingPlace)}
          >
            {stop.timingPlace?.label}
          </span>
        </Row>
      )}
    </td>
  );
};
