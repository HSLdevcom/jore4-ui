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
  area: EnrichedStopPlace;
  onAddStop: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
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

  const point = getGeometryPoint(area.geometry);
  const areaLabel = area.privateCode?.value;
  const areaName = area.name ?? '';

  if (!point || !areaLabel) {
    return null;
  }

  return (
    <Popup
      anchor="top"
      className="mt-5 min-w-80"
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
                  href={routeDetails[Path.stopAreaDetails].getLink(area.id)}
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
            className="h-full !px-3"
            onClick={onDelete}
            inverted
            testId={testIds.deleteButton}
          >
            <MdDelete aria-label={t('stopArea.delete')} className="text-xl" />
          </SimpleButton>

          <SimpleButton
            containerClassName="ml-1"
            className="h-full !px-3"
            inverted
            onClick={onAddStop}
            testId={testIds.addStopButton}
          >
            <MdAddCircle aria-label={t('map.addStop')} className="text-xl" />
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
