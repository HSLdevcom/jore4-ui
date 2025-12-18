import { useTranslation } from 'react-i18next';
import { MdAddCircle, MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { parseDate } from '../../../time';
import { EnrichedStopPlace } from '../../../types';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import {
  findKeyValueParsed,
  getGeometryPoint,
  mapToValidityPeriod,
} from '../../../utils';
import { useMapObservationDate } from '../utils/mapUrlState';

const testIds = {
  label: 'StopAreaPopup::label',
  validityPeriod: 'StopAreaPopup::validityPeriod',
  closeButton: 'StopAreaPopup::closeButton',
  deleteButton: 'StopAreaPopup::deleteButton',
  editButton: 'StopAreaPopup::editButton',
  moveButton: 'StopAreaPopup::moveButton',
  addStopButton: 'StopAreaPopup::addStopButton',
};

type StopAreaPopupProps = {
  readonly area: EnrichedStopPlace;
  readonly onAddStop: () => void;
  readonly onDelete: () => void;
  readonly onEdit: () => void;
  readonly onMove: () => void;
  readonly onClose: () => void;
};

export const StopAreaPopup = ({
  area,
  onAddStop,
  onDelete,
  onEdit,
  onMove,
  onClose,
}: StopAreaPopupProps) => {
  const { t } = useTranslation();

  const observationDate = useMapObservationDate();

  const point = getGeometryPoint(area.geometry);
  const areaLabel = area.privateCode?.value;
  const areaName = area.name ?? '';

  if (!point || !areaLabel) {
    return null;
  }

  return (
    <Popup
      anchor="top"
      className="z-[3] mt-5 min-w-80"
      closeOnClick={false}
      closeButton={false}
      latitude={point.latitude}
      longitude={point.longitude}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row className="items-center">
              <h3>
                <a
                  href={routeDetails[Path.stopAreaDetails].getLink(areaLabel, {
                    observationDate,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={testIds.label}
                  title={t('accessibility:stopAreas.showStopAreaDetails', {
                    areaLabel,
                  })}
                >
                  <span>{areaLabel}</span> <span>{areaName}</span>
                  <i className="icon-open-in-new" aria-hidden />
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

        <Row className="text-sm" testId={testIds.validityPeriod}>
          {mapToValidityPeriod(
            t,
            findKeyValueParsed(area, 'validityStart', parseDate),
            findKeyValueParsed(area, 'validityEnd', parseDate),
          )}
        </Row>

        <Row className="mt-16">
          <SimpleButton
            shape="round"
            className="h-[38px]"
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
            tooltip={t('stopArea.delete')}
          >
            <MdDelete
              role="presentation"
              aria-label={t('stopArea.delete')}
              className="text-xl"
            />
          </SimpleButton>

          <SimpleButton
            shape="round"
            className="ml-1 h-[38px]"
            inverted
            onClick={onAddStop}
            testId={testIds.addStopButton}
            tooltip={t('map.addStop')}
          >
            <MdAddCircle role="presentation" className="text-xl" />
          </SimpleButton>

          <SimpleButton
            className="ml-auto"
            onClick={onMove}
            testId={testIds.moveButton}
          >
            {t('move')}
          </SimpleButton>

          <SimpleButton
            className="ml-2"
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
