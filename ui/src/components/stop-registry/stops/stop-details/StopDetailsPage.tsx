import { useTranslation } from 'react-i18next';
import { useGetStopDetails } from '../../../../hooks';
import { Container } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { StopTitleRow } from './StopTitleRow';

const testIds = {
  page: 'StopDetailsPage::page',
  validityPeriod: 'StopDetailsPage::validityPeriod',
};

export const StopDetailsPage = (): JSX.Element => {
  const { stopDetails } = useGetStopDetails();
  const { t } = useTranslation();

  if (!stopDetails) {
    return <div>404{/* TODO */}</div>;
  }

  return (
    <Container testId={testIds.page}>
      <StopTitleRow stopDetails={stopDetails} />
      <hr className="my-4" />
      <div className="flex items-center">
        <h2 className="">{t('stopDetails.stopDetails')}</h2>
        <div
          className="ml-4"
          title={t('stopDetails.validityPeriod')}
          data-testid={testIds.validityPeriod}
        >
          {mapToShortDate(stopDetails.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(stopDetails.validity_end)}
        </div>
      </div>
    </Container>
  );
};