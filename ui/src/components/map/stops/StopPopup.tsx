import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { Column, Row, Visible } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { parseDate } from '../../../time';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { mapToValidityPeriod } from '../../../utils';
import { StopInfoForEditingOnMap } from '../../forms/stop/utils/useGetStopInfoForEditingOnMap';
import { PriorityBadge } from '../PriorityBadge';

interface Props {
  stop: StopInfoForEditingOnMap;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
  onDelete: () => void;
}

const testIds = {
  label: 'StopPopUp::label',
  moveButton: 'StopPopUp::moveButton',
  editButton: 'StopPopUp::editButton',
  deleteButton: 'StopPopUp::deleteButton',
  closeButton: 'StopPopUp::closeButton',
};

export const StopPopup = ({
  stop,
  onEdit,
  onMove,
  onClose,
  onDelete,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const {
    formState: {
      label: stopLabel,
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

  return (
    <Popup
      className="mt-5 min-w-80"
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
                  href={routeDetails[Path.stopDetails].getLink(stopLabel)}
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
            className="h-full !px-3"
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
          >
            <MdDelete aria-label={t('map.deleteRoute')} className="text-xl" />
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
