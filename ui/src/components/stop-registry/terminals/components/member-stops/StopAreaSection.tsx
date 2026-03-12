import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { ConfirmationDialog, IconButton } from '../../../../../uiComponents';
import { getGeometryPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../../components';
import { LocatableStop } from '../../../types/LocatableStop';
import { useRemoveStopAreaFromTerminal } from './useRemoveStopAreaFromTerminal';

const testIds = {
  stopAreaHeader: 'TerminalDetailsPage::stopAreaHeader',
  removeStopAreaButton: 'TerminalDetailsPage::removeStopAreaButton',
};

type StopAreaSectionProps = {
  readonly id: string;
  readonly terminalId: string;
  readonly privateCode: string;
  readonly name: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
  readonly observationDate: DateTime;
};

type StopAreaHeaderProps = {
  readonly id: string;
  readonly terminalId: string;
  readonly privateCode: string;
  readonly name: string;
  readonly stops: ReadonlyArray<StopSearchRow>;
  readonly observationDate: DateTime;
};

type StopRowProps = {
  readonly stop: StopSearchRow;
  readonly observationDate: DateTime;
};

function buildRemoveStopAreaDescription(
  t: TFunction,
  count: number,
  stopLabels: string,
) {
  return (
    <>
      <p>
        {t('terminalDetails.confirmRemoveStopAreaDialog.description', {
          count,
        })}
        <br />
        <strong>{stopLabels}</strong>
      </p>
      <p className="mt-2">
        {t('terminalDetails.confirmRemoveStopAreaDialog.additionalInfo')}
      </p>
    </>
  );
}

const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  id,
  terminalId,
  privateCode,
  name,
  stops,
  observationDate,
}) => {
  const { t } = useTranslation();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const { removeStopAreaFromTerminal } = useRemoveStopAreaFromTerminal();

  const handleRemoveConfirm = async () => {
    setIsConfirmDialogOpen(false);
    await removeStopAreaFromTerminal(terminalId, id);
  };

  const stopLabels = stops.map((s) => s.publicCode).join(', ');
  const count = stops.length;

  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-bold">
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
          <i className="icon-open-in-new ml-1" aria-hidden />
        </Link>
      </h3>

      <IconButton
        className={twMerge(
          'mr-3 h-10 w-10',
          'rounded-full border border-grey',
          'bg-white text-tweaked-brand',
          'hover:border-tweaked-brand enabled:outline-tweaked-brand',
        )}
        tooltip={t('terminalDetails.stops.removeStopArea', { name })}
        icon={<i className="icon-trash text-xl" aria-hidden />}
        onClick={() => setIsConfirmDialogOpen(true)}
        testId={testIds.removeStopAreaButton}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleRemoveConfirm}
        onCancel={() => setIsConfirmDialogOpen(false)}
        title={t('terminalDetails.confirmRemoveStopAreaDialog.title')}
        description={buildRemoveStopAreaDescription(t, count, stopLabels)}
        confirmText={t(
          'terminalDetails.confirmRemoveStopAreaDialog.confirmText',
        )}
        cancelText={t('cancel')}
      />
    </div>
  );
};

const StopRow: FC<StopRowProps> = ({ stop, observationDate }) => {
  const locatableStop: LocatableStop = {
    label: stop.publicCode,
    netexId: stop.netexId,
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
  id,
  terminalId,
  privateCode,
  name,
  stops,
  observationDate,
}) => {
  return (
    <div className="mt-4" data-testid="TerminalDetailsPage::stopAreaSection">
      <StopAreaHeader
        id={id}
        terminalId={terminalId}
        privateCode={privateCode}
        name={name}
        stops={stops}
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
