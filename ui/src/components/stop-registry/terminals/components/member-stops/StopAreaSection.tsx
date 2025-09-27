import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { getGeometryPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../../components';
import { LocatableStop } from '../../../types/LocatableStop';

const testIds = {
  stopAreaHeader: 'TerminalDetailsPage::stopAreaHeader',
};

type StopAreaSectionProps = {
  readonly privateCode: string;
  readonly name: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
  readonly observationDate: DateTime;
};

type StopAreaHeaderProps = {
  readonly privateCode: string;
  readonly name: string;
  readonly observationDate: DateTime;
};

type StopRowProps = {
  readonly stop: StopSearchRow;
  readonly observationDate: DateTime;
};

const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  privateCode,
  name,
  observationDate,
}) => {
  const { t } = useTranslation();
  return (
    <h3 className="mb-2 font-bold">
      <Link
        to={routeDetails[Path.stopAreaDetails].getLink(privateCode, {
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
    label: stop.publicCode,
    netextId: stop.netexId,
    location: getGeometryPoint(stop.location),
  };

  return (
    <StopTableRow
      key={stop.id}
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
  privateCode,
  name,
  stops,
  observationDate,
}) => {
  return (
    <div className="mt-4" data-testid="TerminalDetailsPage::stopAreaSection">
      <StopAreaHeader
        privateCode={privateCode}
        name={name}
        observationDate={observationDate}
      />
      <table
        className="w-full border-x border-x-light-grey"
        data-testid="TerminalDetailsPage::stopAreaStopsTable"
      >
        <tbody>
          {stops.map((stop) => (
            <StopRow
              key={stop.id}
              stop={stop}
              observationDate={observationDate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
