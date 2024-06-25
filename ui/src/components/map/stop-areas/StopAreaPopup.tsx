import noop from 'lodash/noop';
import { useTranslation } from 'react-i18next';
import { MdDelete } from 'react-icons/md';
import { Popup } from 'react-map-gl/maplibre';
import { StopAreaMinimalShowOnMapFieldsFragment } from '../../../generated/graphql';
import { Column, Row } from '../../../layoutComponents';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import {
  getGeometryPoint,
  getNameFromAlternatives,
  mapToValidityPeriod,
} from '../../../utils';

const testIds = {
  label: 'StopAreaPopup::label',
  closeButton: 'StopAreaPopup::closeButton',
  deleteButton: 'StopAreaPopup::deleteButton',
  editButton: 'StopAreaPopup::editButton',
  moveButton: 'StopAreaPopup::moveButton',
};

type StopAreaPopupProps = {
  readonly area: StopAreaMinimalShowOnMapFieldsFragment;
  readonly onClose: () => void;
};

export const StopAreaPopup = ({ area, onClose }: StopAreaPopupProps) => {
  const { t } = useTranslation();

  const point = getGeometryPoint(area.centroid);
  const areaLabel = getNameFromAlternatives(
    area.name_value,
    area.name_lang,
    area.alternative_names.map((it) => it.alternative_name),
  );

  if (!point || !areaLabel) {
    return null;
  }

  return (
    <Popup
      anchor="top"
      className="min-w-80"
      closeOnClick={false}
      closeButton={false}
      latitude={point.latitude}
      longitude={point.longitude}
    >
      <div className="p-2">
        <Row>
          <Column className="w-full">
            <Row className="items-center">
              <h3 data-testid={testIds.label}>
                {t('stopArea.areaWithLabel', { areaLabel })}
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
            {mapToValidityPeriod(t, area.from_date, area.to_date)}
          </Row>
        </Row>

        <Row className="mt-16">
          <SimpleButton
            className="h-full !px-3"
            disabled
            onClick={noop}
            inverted
            testId={testIds.deleteButton}
          >
            <MdDelete aria-label={t('stopArea.delete')} className="text-xl" />
          </SimpleButton>
          <SimpleButton
            containerClassName="ml-auto"
            disabled
            onClick={noop}
            testId={testIds.moveButton}
          >
            {t('move')}
          </SimpleButton>
          <SimpleButton
            containerClassName="ml-2"
            disabled
            onClick={noop}
            testId={testIds.editButton}
          >
            {t('edit')}
          </SimpleButton>
        </Row>
      </div>
    </Popup>
  );
};
