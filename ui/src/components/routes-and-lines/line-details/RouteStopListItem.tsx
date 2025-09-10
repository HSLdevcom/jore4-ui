import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdHistory } from 'react-icons/md';
import {
  RouteStopFieldsFragment,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
} from '../../../generated/graphql';
import { useAppDispatch } from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import { openTimingSettingsModalAction } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import {
  MAX_DATE,
  MIN_DATE,
  mapToShortDate,
  mapToShortDateTime,
} from '../../../time';
import { IconButton } from '../../../uiComponents';
import { AlertPopover } from '../../common/AlertPopover';
import { useAlertsAndHighLights } from '../../common/hooks/useAlertsAndHighLights';
import { HastusCode } from './HastusCode';
import { StopActionsDropdown } from './StopActionsDropdown';

const testIds = {
  container: 'RouteStopListItem::container',
  label: 'RouteStopListItem::label',
  name: 'RouteStopListItem::name',
  validityPeriod: 'RouteStopListItem::validityPeriod',
  lastEdited: 'RouteStopListItem::lastEdited',
  hastusCode: 'RouteStopListItem::hastusCode',
  openTimingSettingsButton: 'RouteStopListItem::openTimingSettingsButton',
  viaIcon: 'RouteStopListItem::viaIcon',
};

type RouteStopListItemProps = {
  readonly className?: string;
  readonly stop: RouteStopFieldsFragment;
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly labelledBy: string;
  readonly observationDate: DateTime;
};

export const RouteStopListItem: FC<RouteStopListItemProps> = ({
  className = '',
  stop,
  route,
  labelledBy,
  observationDate,
}) => {
  const { t } = useTranslation();
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

  const { getAlertStatus, getAlertStyle } = useAlertsAndHighLights();
  const alertStatus = getAlertStatus(stop);
  const alertStyle = getAlertStyle(alertStatus.alertLevel);
  const hastusCode = stop.timing_place?.label;

  const journeyPatternId =
    scheduledStopPointInJourneyPattern?.journey_pattern_id;

  const scheduledStopPointSequence =
    scheduledStopPointInJourneyPattern?.scheduled_stop_point_sequence;

  const stopLabel = stop.label;

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

  // alertStyle left border is different colour than what we want the bottom border to be
  // and to achieve the correct visual design for the borders, we need to add it with pseudo classes
  const pseudoBottomBorderClassName =
    'after:absolute after:bottom-0 after:left-0 after:right-0 after:border-b-2 after:border-gray-100';

  return (
    <li
      className={`relative grid min-h-16 items-center border-r border-r-gray-100 sm:grid-cols-12 md:grid-cols-24 ${pseudoBottomBorderClassName} ${alertStyle.listItemBorder ?? ''} ${
        stopBelongsToJourneyPattern ? '' : 'bg-background text-dark-grey'
      } ${className}`}
      aria-labelledby={labelledBy}
      data-testid={testIds.container}
    >
      <div className="col-span-3 items-center justify-center text-center text-2xl">
        <a
          href={routeDetails[Path.stopDetails].getLink(stop.label, {
            observationDate,
          })}
          data-testid={testIds.label}
          title={t('accessibility:stops.showStopDetails', { stopLabel })}
        >
          {stop.label}
        </a>
      </div>
      <div className="col-span-9 flex items-center" data-testid={testIds.name}>
        <span>{stop.stop_place?.at(0)?.name?.value ?? '-'}</span>
        <Visible visible={isViaPoint}>
          <i
            data-testid={testIds.viaIcon}
            className="icon-via text-4xl text-hsl-dark-green"
          />
        </Visible>
      </div>
      <span
        className="col-span-4 text-center"
        data-testid={testIds.validityPeriod}
      >
        {stopBelongsToJourneyPattern
          ? t('validity.validDuring', {
              startDate: mapToShortDate(stop.validity_start ?? MIN_DATE),
              endDate: mapToShortDate(stop.validity_end ?? MAX_DATE),
            })
          : t('stops.notPartOfRoute')}
      </span>
      <div className="items-center">
        <AlertPopover
          title={t(alertStatus.title, {
            type: t('routes.route'),
          })}
          description={t(alertStatus.description)}
          alertIcon={alertStyle.icon}
        />
      </div>
      <span className="col-span-4 text-center" data-testid={testIds.lastEdited}>
        !{mapToShortDateTime(DateTime.now())}
        <MdHistory className="aria-hidden ml-1 inline text-xl text-tweaked-brand" />
      </span>
      <div className="col-span-2 flex justify-center">
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
            tooltip={`${t('accessibility:routes.openTimingSettings', {
              stopLabel,
            })}`}
            onClick={showTimingSettingsModal}
            className="ml-2 rounded-full leading-none"
            disabled={!stopBelongsToJourneyPattern}
          />
        )}
      </div>
      <StopActionsDropdown
        tooltip={t('accessibility:routes.showStopActions', { stopLabel })}
        stopLabel={stopLabel}
        stopBelongsToJourneyPattern={stopBelongsToJourneyPattern}
        isViaPoint={isViaPoint}
        route={route}
        journeyPatternId={journeyPatternId}
        scheduledStopPointSequence={scheduledStopPointSequence}
      />
    </li>
  );
};
