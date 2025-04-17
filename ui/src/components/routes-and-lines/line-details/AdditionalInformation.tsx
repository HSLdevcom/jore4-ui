import React from 'react';
import { useTranslation } from 'react-i18next';
import { LineAllFieldsFragment } from '../../../generated/graphql';
import {
  mapLineTypeToUiName,
  mapTransportTargetToUiName,
  mapVehicleModeToUiName,
} from '../../../i18n/uiNameMappings';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { EditButton } from '../../../uiComponents';
import { FieldValue } from './FieldValue';

const testIds = {
  editLineButton: 'AdditionalInformation::editLineButton',
  name: 'AdditionalInformation::name',
  primaryVehicleMode: 'AdditionalInformation::primaryVehicleMode',
  label: 'AdditionalInformation::label',
  typeOfLine: 'AdditionalInformation::typeOfLine',
  transportTarget: 'AdditionalInformation::transportTarget',
};

interface Props {
  className?: string;
  line: LineAllFieldsFragment;
}

export const AdditionalInformation: React.FC<Props> = ({
  className = '',
  line,
}) => {
  const { t } = useTranslation();
  return (
    <Column className={className}>
      <Row className="mb-10 items-center text-3xl font-semibold">
        {t('lines.additionalInformation')}
        <EditButton
          href={routeDetails[Path.editLine].getLink(line.line_id)}
          testId={testIds.editLineButton}
          tooltip={t('accessibility:lines.edit', { label: line.label })}
        />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.linesName')}
          value={line.name_i18n.fi_FI}
          testId={testIds.name}
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.primaryVehicleMode')}
          value={mapVehicleModeToUiName(t, line.primary_vehicle_mode)}
          testId={testIds.primaryVehicleMode}
        />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.label')}
          value={line.label}
          testId={testIds.label}
        />
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.typeOfLine')}
          value={mapLineTypeToUiName(t, line.type_of_line)}
          testId={testIds.typeOfLine}
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.transportTarget')}
          value={mapTransportTargetToUiName(t, line.transport_target)}
          testId={testIds.transportTarget}
        />
      </Row>
    </Column>
  );
};
