import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../../generated/graphql';
import {
  mapLineTypeToUiName,
  mapTransportTargetToUiName,
  mapVehicleModeToUiName,
} from '../../../i18n/uiNameMappings';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { EditButton } from '../../../uiComponents';
import { FieldValue } from './FieldValue';

interface Props {
  className?: string;
  line: RouteLine;
}

export const AdditionalInformation: React.FC<Props> = ({ className, line }) => {
  const { t } = useTranslation();
  return (
    <Column className={className}>
      <Row className="mb-10 items-center text-3xl font-semibold">
        {t('lines.additionalInformation')}
        <EditButton
          href={routeDetails[Path.editLine].getLink(line.line_id)}
          testId="edit-line-button"
        />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.linesName')}
          value={line.name_i18n.fi_FI}
          testId="line-details-name"
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.primaryVehicleMode')}
          value={mapVehicleModeToUiName(line.primary_vehicle_mode)}
          testId="line-details-primary-vehicle-mode"
        />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.label')}
          value={line.label}
          testId="line-details-label"
        />
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.linesType')}
          value={mapLineTypeToUiName(line.type_of_line)}
          testId="line-details-type-of-line"
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.transportTarget')}
          value={mapTransportTargetToUiName(line.transport_target)}
          testId="line-details-transport-target"
        />
      </Row>
    </Column>
  );
};
