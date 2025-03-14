import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { StopWithLocation } from '../../../graphql';
import { Column, Row, Visible } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { mapLngLatToPoint, mapToValidityPeriod } from '../../../utils';
import { PriorityBadge } from '../PriorityBadge';

interface Props {
  stop: Required<StopWithLocation>;
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
  // eslint-disable-next-line camelcase
  const { label: stopLabel, priority, validity_start, validity_end } = stop;
  const location = mapLngLatToPoint(stop.measured_location.coordinates);
  return (
    <Popup
      className="mt-5 min-w-80"
      anchor="top"
      longitude={location.longitude}
      latitude={location.latitude}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row className="items-center">
              <h3>
                <a
                  href={routeDetails[Path.stopDetails].getLink(stop.label)}
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
              <Visible visible={!!stop.timing_place?.label}>
                <span
                  className="text-sm text-hsl-dark-80"
                  title={t('accessibility:stops.timingPlace')}
                >
                  {stop.timing_place?.label}
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
              // eslint-disable-next-line camelcase
              validityStart={validity_start}
              // eslint-disable-next-line camelcase
              validityEnd={validity_end}
            />
            {mapToValidityPeriod(t, validity_start, validity_end)}
          </Row>
        </Row>
        <Row className="mt-16">
          <SimpleButton
            className="h-full !px-3"
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
            // TODO: Fix Stop creation/editing/deletion
            disabled
            disabledTooltip={t('dataModelRefactor.disabled')}
          >
            <MdDelete aria-label={t('map.deleteRoute')} className="text-xl" />
          </SimpleButton>
          <SimpleButton
            containerClassName="ml-auto"
            onClick={onMove}
            testId={testIds.moveButton}
            // TODO: Fix Stop creation/editing/deletion
            disabled
            disabledTooltip={t('dataModelRefactor.disabled')}
          >
            {t('move')}
          </SimpleButton>
          <SimpleButton
            containerClassName="ml-2"
            onClick={onEdit}
            testId={testIds.editButton}
            // TODO: Fix Stop creation/editing/deletion
            disabled
            disabledTooltip={t('dataModelRefactor.disabled')}
          >
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
