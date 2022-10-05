import { useTranslation } from 'react-i18next';
import { Container } from '../../layoutComponents';
import { PageHeader } from '../routes-and-lines/common/PageHeader';
import { VehicleServiceTable } from './vehicle-service-table';

export const VehicleScheduleDetailsPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader>
        <h1>
          <i className="icon-bus-alt text-tweaked-brand" />
          {t('lines.line', { label: '!1234' })}
        </h1>
      </PageHeader>
      <Container className="pt-10">
        <VehicleServiceTable />
      </Container>
    </div>
  );
};
