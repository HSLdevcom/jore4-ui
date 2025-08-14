import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { mapLngLatToPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../../components';
import { StopTableRow } from '../../../search';
import { StopSearchRow } from '../../../search/types';
import { LocatableStop } from '../../../types/LocatableStop';

const testIds = {
  stopAreaHeader: 'TerminalDetailsPage::stopAreaHeader',
};

type StopAreaSectionProps = {
  readonly id: string | number;
  readonly name: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
  readonly observationDate: DateTime;
};

type StopAreaHeaderProps = {
  readonly id: string | number;
  readonly name: string;
  readonly observationDate: DateTime;
};

type StopRowProps = {
  readonly stop: StopSearchRow;
  readonly observationDate: DateTime;
};

const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  id,
  name,
  observationDate,
}) => {
  const { t } = useTranslation();
  return (
    <h3 className="mb-2 font-bold">
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(String(id), {
          observationDate,
        })}
        title={t('accessibility:stopAreas.showStopAreaDetails', {
          areaLabel: name,
        })}
        data-testid={testIds.stopAreaHeader}
      >
        <span>{name}</span>
        <i className="icon-open-in-new ml-1" aria-hidden="true" />
      </Link>
    </h3>
  );
};

const StopRow: FC<StopRowProps> = ({ stop, observationDate }) => {
  const locatableStop: LocatableStop = {
    label: stop.label,
    netextId: stop.quay.netexId ?? null,
    location: mapLngLatToPoint(stop.measured_location.coordinates),
  };
  return (
    <StopTableRow
      key={stop.scheduled_stop_point_id}
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <OpenDetailsPage key="OpenDetailsPage" stop={locatableStop} />,
        <ShowOnMap key="ShowOnMap" stop={locatableStop} />,
      ]}
      observationDate={observationDate}
      stop={stop}
    />
  );
};

export const StopAreaSection: FC<StopAreaSectionProps> = ({
  id,
  name,
  stops,
  observationDate,
}) => {
  return (
    <div className="mt-4" data-testid="TerminalDetailsPage::stopAreaSection">
      <StopAreaHeader id={id} name={name} observationDate={observationDate} />
      <table
        className="w-full border-x border-x-light-grey"
        data-testid="TerminalDetailsPage::stopAreaStopsTable"
      >
        <tbody>
          {stops.map((stop) => (
            <StopRow
              key={stop.scheduled_stop_point_id}
              stop={stop}
              observationDate={observationDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
