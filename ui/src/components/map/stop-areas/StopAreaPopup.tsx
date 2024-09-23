import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { StopAreaByIdResult } from '../../../types';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { getGeometryPoint, mapToValidityPeriod } from '../../../utils';

const testIds = {
  label: 'StopAreaPopup::label',
  validityPeriod: 'StopAreaPopup::validityPeriod',
  closeButton: 'StopAreaPopup::closeButton',
  deleteButton: 'StopAreaPopup::deleteButton',
  editButton: 'StopAreaPopup::editButton',
  moveButton: 'StopAreaPopup::moveButton',
};

type StopAreaPopupProps = {
  area: StopAreaByIdResult;
  onDelete: () => void;
  onEdit: () => void;
  onMove: () => void;
  onClose: () => void;
};

export const StopAreaPopup = ({
  area,
  onDelete,
  onEdit,
  onMove,
  onClose,
}: StopAreaPopupProps) => {
  const { t } = useTranslation();

  const point = getGeometryPoint(area.geometry);
  const areaLabel = area.name?.value;
  const areaDescription = area.description?.value ?? '';

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
                  <span>{areaLabel}</span> <span>{areaDescription}</span>
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
            area.validBetween?.fromDate,
            area.validBetween?.toDate,
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
