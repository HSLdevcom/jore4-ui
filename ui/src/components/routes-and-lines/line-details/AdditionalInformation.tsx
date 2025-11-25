import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LineAllFieldsFragment } from '../../../generated/graphql';
import {
  mapLineTypeToUiName,
  mapTransportTargetToUiName,
  mapVehicleModeToUiName,
} from '../../../i18n/uiNameMappings';
import { Column, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { FieldValue } from './FieldValue';

const testIds = {
  editLineButton: 'AdditionalInformation::editLineButton',
  name: 'AdditionalInformation::name',
  nameSwe: 'AdditionalInformation::nameSwe',
  primaryVehicleMode: 'AdditionalInformation::primaryVehicleMode',
  label: 'AdditionalInformation::label',
  typeOfLine: 'AdditionalInformation::typeOfLine',
  transportTarget: 'AdditionalInformation::transportTarget',
};

type AdditionalInformationProps = {
  readonly className?: string;
  readonly line: LineAllFieldsFragment;
};

export const AdditionalInformation: FC<AdditionalInformationProps> = ({
  className = '',
  line,
}) => {
  const { t } = useTranslation();
  return (
    <Column className={className}>
      <Row className="mb-4 items-center">
        <h2>{t('lines.additionalInformation')}</h2>
        <SimpleButton
          href={routeDetails[Path.editLine].getLink(line.line_id)}
          testId={testIds.editLineButton}
          tooltip={t('accessibility:lines.edit', { label: line.label })}
          inverted
          className="ml-4 py-0.5"
        >
          {t('edit')}
        </SimpleButton>
      </Row>
      <Row className="mb-5 gap-6">
        <FieldValue
          fieldName={t('lines.label')}
          value={line.label}
          testId={testIds.label}
        />
        <FieldValue
          fieldName={t('lines.name.fi_FI')}
          value={line.name_i18n.fi_FI}
          testId={testIds.name}
        />
        <FieldValue
          fieldName={t('lines.name.sv_FI')}
          value={line.name_i18n.sv_FI}
          testId={testIds.nameSwe}
        />
      </Row>
      <Row className="mb-5 gap-6">
        <FieldValue
          fieldName={t('lines.primaryVehicleMode')}
          value={mapVehicleModeToUiName(t, line.primary_vehicle_mode)}
          testId={testIds.primaryVehicleMode}
        />
        <FieldValue
          fieldName={t('lines.typeOfLine')}
          value={mapLineTypeToUiName(t, line.type_of_line)}
          testId={testIds.typeOfLine}
        />
        <FieldValue
          fieldName={t('lines.transportTarget')}
          value={mapTransportTargetToUiName(t, line.transport_target)}
          testId={testIds.transportTarget}
        />
      </Row>
    </Column>
  );
};
