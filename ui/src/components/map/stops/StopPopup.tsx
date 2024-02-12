import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl';
import { StopPopupInfoFragment } from '../../../generated/graphql';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { mapLngLatToPoint, mapToValidityPeriod } from '../../../utils';
import { PriorityBadge } from '../PriorityBadge';

interface Props {
  stop: StopPopupInfoFragment;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
  onDelete: () => void;
}

const GQL_STOP_POPUP_INFO = gql`
  fragment stop_popup_info on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    priority
    validity_start
    validity_end
    measured_location
  }
`;

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
}: Props): JSX.Element => {
  const { t } = useTranslation();
  // eslint-disable-next-line camelcase
  const { label: stopLabel, priority, validity_start, validity_end } = stop;
  const location = mapLngLatToPoint(stop.measured_location.coordinates);
  return (
    <Popup
      className="w-80"
      tipSize={10}
      offsetTop={25}
      anchor="top"
      longitude={location.longitude}
      latitude={location.latitude}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row>
              <h3>
                <a
                  href={routeDetails[Path.stopDetails].getLink(
                    stop.scheduled_stop_point_id,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={testIds.label}
                  title={t('accessibility:stops.showStopDetails', {
                    stopLabel,
                  })}
                >
                  {t('stops.stopWithLabel', { stopLabel })}
                  <i className="icon-open-in-new" />
                </a>
              </h3>
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
