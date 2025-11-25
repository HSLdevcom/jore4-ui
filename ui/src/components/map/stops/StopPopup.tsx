import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdControlPointDuplicate, MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { useAppSelector } from '../../../hooks';
import { Column, Row, Visible } from '../../../layoutComponents';
import { FilterType, selectMapFilter } from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { parseDate } from '../../../time';
import { Priority } from '../../../types/enums';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { mapToValidityPeriod } from '../../../utils';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { PriorityBadge } from '../PriorityBadge';
import { useMapObservationDate } from '../utils/mapUrlState';

type StopPopupProps = {
  readonly stop: StopInfoForEditingOnMap;
  readonly onEdit: () => void;
  readonly onMove: () => void;
  readonly onClose: () => void;
  readonly onDelete: () => void;
  readonly onCopy: () => void;
};

const testIds = {
  label: 'StopPopUp::label',
  moveButton: 'StopPopUp::moveButton',
  editButton: 'StopPopUp::editButton',
  deleteButton: 'StopPopUp::deleteButton',
  copyButton: 'StopPopUp::copyButton',
  closeButton: 'StopPopUp::closeButton',
};

function useLinkToDetailsPage(
  publicCode: string,
  validityStart: DateTime,
  priority: Priority,
): string {
  const { stopFilters } = useAppSelector(selectMapFilter);

  const observationDate = useMapObservationDate();

  const showHighestPriorityCurrentStops =
    stopFilters[FilterType.ShowHighestPriorityCurrentStops];

  // AKA default map mode. → Standard/Temp prio, on selected day.
  if (showHighestPriorityCurrentStops) {
    return routeDetails[Path.stopDetails].getLink(publicCode, {
      observationDate,
    });
  }

  return routeDetails[Path.stopDetails].getLink(publicCode, {
    observationDate: validityStart,
    priority,
  });
}

export const StopPopup: FC<StopPopupProps> = ({
  stop,
  onEdit,
  onMove,
  onClose,
  onDelete,
  onCopy,
}) => {
  const { t } = useTranslation();

  const {
    formState: {
      publicCode: { value: stopLabel },
      priority,
      validityStart: validityStartStr,
      validityEnd: validityEndStr,
      latitude,
      longitude,
    },
    timingPlaceInfo,
  } = stop;
  const { label: timingPlaceLabel } = timingPlaceInfo ?? {};

  const validityStart = parseDate(validityStartStr);
  const validityEnd = parseDate(validityEndStr);

  const linkToDetailsPage = useLinkToDetailsPage(
    stopLabel,
    validityStart,
    priority,
  );

  return (
    <Popup
      className="z-[3] mt-5 min-w-80"
      anchor="top"
      longitude={longitude}
      latitude={latitude}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row className="items-center">
              <h3>
                <a
                  href={linkToDetailsPage}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={testIds.label}
                  title={t('accessibility:stops.showStopDetails', {
                    stopLabel,
                  })}
                >
                  {t('stops.stopWithLabel', { stopLabel })}
                  <i className="icon-open-in-new" aria-hidden />
                </a>
              </h3>
              <Visible visible={!!timingPlaceLabel}>
                <span
                  className="text-sm text-hsl-dark-80"
                  title={t('accessibility:stops.timingPlace')}
                >
                  {timingPlaceLabel}
                </span>
              </Visible>
              <CloseIconButton
                className="ml-auto"
                onClick={onClose}
                testId={testIds.closeButton}
              />
            </Row>
          </Column>
        </Row>
        <Row>
          <Row className="items-center gap-1.5 text-sm">
            <PriorityBadge
              priority={priority}
              validityStart={validityStart}
              validityEnd={validityEnd}
            />
            {mapToValidityPeriod(t, validityStart, validityEnd)}
          </Row>
        </Row>
        <Row className="mt-16">
          <SimpleButton
            className="flex aspect-square h-[38px] w-[38px] items-center justify-center self-stretch p-0"
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
            tooltip={t('map.deleteStop')}
          >
            <MdDelete role="presentation" className="text-xl" />
          </SimpleButton>

          <SimpleButton
            className="ml-2 flex aspect-square h-[38px] w-[38px] items-center justify-center self-stretch p-0"
            onClick={onCopy}
            inverted
            testId={testIds.copyButton}
            tooltip={t('map.copyStop')}
          >
            <MdControlPointDuplicate role="presentation" className="text-xl" />
          </SimpleButton>

          <SimpleButton
            containerClassName="ml-auto"
            onClick={onMove}
            testId={testIds.moveButton}
          >
            {t('move')}
          </SimpleButton>

          <SimpleButton
            containerClassName="ml-2"
            onClick={onEdit}
            testId={testIds.editButton}
          >
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
