import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteLine } from '../../generated/graphql';
import { Column, Row } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import { EditButton } from '../../uiComponents';
import { FieldValue } from '../forms/FieldValue';

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
        <EditButton href={routes[Path.editLine].getLink(line.line_id)} />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.linesName')}
          value={line.name_i18n}
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.primaryVehicleMode')}
          value={line.primary_vehicle_mode}
        />
      </Row>
      <Row className="mb-5">
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.label')}
          value={line.label}
        />
        <FieldValue
          className="w-1/4"
          fieldName={t('lines.linesType')}
          value="!Peruslinja"
        />
        <FieldValue
          className="w-1/2"
          fieldName={t('lines.areaOfOperation')}
          value="!Helsingin sisäinen liikenne"
        />
      </Row>
    </Column>
  );
};
