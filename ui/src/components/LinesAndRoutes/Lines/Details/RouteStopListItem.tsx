import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';
import {
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
} from '../../../../generated/graphql';
import {
  openTimingSettingsModalAction,
  useAppDispatch,
} from '../../../../redux';
import { hasContinuingVersion } from '../../../../utils';
import { useGetLocalizedTextFromDbBlob } from '../../../../utils/i18n';
import { MAX_DATE, MIN_DATE } from '../../../../utils/time';
import { IconButton } from '../../../common/Buttons';
import { Visible } from '../../../common/LayoutComponents';
import { getAlertStatus, getAlertStyle } from '../../../common/Utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../../StopRegistry/Components';
import {
  StopSearchRow,
  stopTableCellClassNames as cells,
  mapQueryResultToStopSearchRow,
  mapStopSearchRowToLocatableStop,
} from '../../../StopRegistry/Components/StopTableRow';
import {
  ActionButtonsTd,
  IconsTd,
  NameAndIconsTd,
  NameTd,
  PlatformNumberTd,
  PriorityTd,
  StopLabelLink,
  ValidityPeriodTd,
} from '../../../StopRegistry/Components/StopTableRow/components';
import { AlertPopover } from '../../Common/AlertPopover';
import { HastusCode } from './HastusCode';
import { StopActionsDropdown } from './StopActionsDropdown';

const testIds = {
  container: 'RouteStopListItem::container',
  notPartOfRoute: 'RouteStopListItem::notPartOfRoute',
  hastusCode: 'RouteStopListItem::hastusCode',
  openTimingSettingsButton: 'RouteStopListItem::openTimingSettingsButton',
  viaIcon: 'RouteStopListItem::viaIcon',
  destination: 'RouteStopListItem::destination',
};

function mapRouteStopToStopSearchRow(
  stop: RouteStopFieldsFragment,
): StopSearchRow {
  const registryStop = mapQueryResultToStopSearchRow(
    stop.newest_quay,
    stop,
  ) ?? {
    id: stop.scheduled_stop_point_id,
    netexId: stop.newest_quay?.netex_id ?? '',
    scheduledStopPointId: stop.scheduled_stop_point_id,
    publicCode: stop.label,
    nameFin: stop.stop_place?.at(0)?.name?.value ?? '-',
    nameSwe: null,
    location: stop.measured_location,
    transportModes: [],
    activeTransportModes: [],
    trunkLineStop: false,
    speedTramStop: false,
    timingPlace: null,
  };

  // The route view shows the scheduled stop point's own validity and priority
  return {
    ...registryStop,
    validityStart: stop.validity_start ?? MIN_DATE,
    validityEnd: stop.validity_end ?? MAX_DATE,
    priority: stop.priority,
  };
}

type DestinationSignProps = {
  readonly destinationName: string;
  readonly viaName: string;
};

const DestinationSign: FC<DestinationSignProps> = ({
  destinationName,
  viaName,
}) => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.destination}>
      {viaName
        ? t(($) => $.destinationModal.signWithVia, {
            destination: destinationName,
            via: viaName,
          })
        : destinationName}
    </div>
  );
};

type RouteStopListItemProps = {
  readonly className?: string;
  readonly stop: RouteStopFieldsFragment;
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly observationDate: Temporal.PlainDate;
};

export const RouteStopListItem: FC<RouteStopListItemProps> = ({
  className,
  stop,
  route,
  observationDate,
}) => {
  const { t } = useTranslation();
  const getLocalizedText = useGetLocalizedTextFromDbBlob();
  const dispatch = useAppDispatch();

  // find the journey pattern instance that belongs to this route
  const scheduledStopPointInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns.find(
      (item) => item.journey_pattern.on_route_id === route.route_id,
    );

  // does the stop belong to this route's journey pattern?
  const stopBelongsToJourneyPattern = !!scheduledStopPointInJourneyPattern;

  // is the stop via point on this route's journey pattern?
  const isViaPoint = scheduledStopPointInJourneyPattern?.is_via_point;

  const isUsedAsTimingPoint =
    scheduledStopPointInJourneyPattern?.is_used_as_timing_point;

  const alertStatus = getAlertStatus(t, {
    ...stop,
    hasContinuingVersion: hasContinuingVersion(
      stop,
      stop.other_label_instances,
    ),
  });
  const alertStyle = getAlertStyle(alertStatus.alertLevel);
  const hastusCode = stop.timing_place?.label;

  const journeyPatternId =
    scheduledStopPointInJourneyPattern?.journey_pattern_id;

  const scheduledStopPointSequence =
    scheduledStopPointInJourneyPattern?.scheduled_stop_point_sequence;

  const stopLabel = stop.label;
  const rowStop = mapRouteStopToStopSearchRow(stop);
  const locatableStop = mapStopSearchRowToLocatableStop(rowStop);

  const destinationName =
    scheduledStopPointInJourneyPattern?.is_destination_point
      ? getLocalizedText(
          scheduledStopPointInJourneyPattern.destination_point_name_i18n,
        )
      : '';
  const viaName = isViaPoint
    ? getLocalizedText(scheduledStopPointInJourneyPattern?.via_point_name_i18n)
    : '';
  const nameDetails = destinationName ? (
    <DestinationSign destinationName={destinationName} viaName={viaName} />
  ) : null;

  const showTimingSettingsModal = () => {
    if (journeyPatternId && scheduledStopPointSequence !== undefined) {
      dispatch(
        openTimingSettingsModalAction({
          stopLabel,
          journeyPatternId,
          sequence: scheduledStopPointSequence,
        }),
      );
    }
  };

  const nameExtras = (
    <>
      <AlertPopover
        title={alertStatus.title}
        description={alertStatus.description}
        alertIcon={alertStyle.icon}
      />
      <Visible visible={isViaPoint}>
        <i
          data-testid={testIds.viaIcon}
          className="icon-via mx-2 text-4xl text-hsl-dark-green"
        />
      </Visible>
    </>
  );

  return (
    <tr
      className={twMerge(
        cells.row,
        alertStyle.listItemBorder,
        'border-r border-r-light-grey',
        stopBelongsToJourneyPattern ? '' : 'bg-background text-dark-grey',
        className,
      )}
      data-testid={testIds.container}
    >
      <PriorityTd className={cells.priority} stop={rowStop} />

      <td className={cells.label}>
        <StopLabelLink observationDate={observationDate} stop={rowStop} />
        <div className="mt-2 flex items-center text-sm">
          {hastusCode ? (
            <HastusCode
              hastusCode={hastusCode}
              isUsedAsTimingPoint={isUsedAsTimingPoint}
              testId={testIds.hastusCode}
            />
          ) : (
            <IconButton
              testId={testIds.openTimingSettingsButton}
              icon={
                <AiFillPlusCircle
                  className={`text-xl ${
                    stopBelongsToJourneyPattern ? 'text-brand' : 'text-gray-300'
                  }`}
                />
              }
              tooltip={`${t(($) => $.accessibility.routes.openTimingSettings, {
                stopLabel,
              })}`}
              onClick={showTimingSettingsModal}
              className="ml-2 rounded-full leading-none"
              disabled={!stopBelongsToJourneyPattern}
            />
          )}
        </div>
      </td>

      <PlatformNumberTd className={cells.platformNumber} stop={rowStop} />

      <NameTd
        className={cells.nameWide}
        stop={rowStop}
        nameDetails={nameDetails}
      >
        {nameExtras}
      </NameTd>

      <IconsTd className={cells.iconsWide} stop={rowStop} />

      <NameAndIconsTd
        className={cells.nameAndIconsNarrow}
        stop={rowStop}
        nameDetails={nameDetails}
      >
        {nameExtras}
      </NameAndIconsTd>

      {stopBelongsToJourneyPattern ? (
        <ValidityPeriodTd className={cells.validity} stop={rowStop} />
      ) : (
        <td className={cells.validity}>
          <span
            className="text-sm whitespace-nowrap"
            data-testid={testIds.notPartOfRoute}
          >
            {t(($) => $.stops.notPartOfRoute)}
          </span>
        </td>
      )}

      <ActionButtonsTd
        actionButtons={
          <LocatorActionButton
            stop={locatableStop}
            observationDate={observationDate}
          />
        }
        className={cells.actionButtons}
      />

      <td className={cells.actionMenu}>
        <StopActionsDropdown
          tooltip={t(($) => $.accessibility.routes.showStopActions, {
            stopLabel,
          })}
          stopLabel={stopLabel}
          stopNameFi={rowStop.nameFin}
          stopNameSv={rowStop.nameSwe}
          stopBelongsToJourneyPattern={stopBelongsToJourneyPattern}
          isViaPoint={isViaPoint}
          route={route}
          journeyPatternId={journeyPatternId}
          scheduledStopPointSequence={scheduledStopPointSequence}
        >
          <ShowOnMap stop={locatableStop} observationDate={observationDate} />
          <OpenDetailsPage
            stop={locatableStop}
            observationDate={observationDate}
            priority={rowStop.priority}
          />
        </StopActionsDropdown>
      </td>
    </tr>
  );
};
