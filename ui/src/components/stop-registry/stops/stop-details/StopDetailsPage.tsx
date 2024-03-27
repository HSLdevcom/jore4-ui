import { useTranslation } from 'react-i18next';
import { useGetStopDetails } from '../../../../hooks';
import { Container } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { BasicDetailsSection } from './BasicDetailsSection';
import { LocationDetailsSection } from './LocationDetailsSection';
import { SignageDetailsSection } from './SignageDetailsSection';
import { StopHeaderSummaryRow } from './StopHeaderSummaryRow';
import { StopTitleRow } from './StopTitleRow';

const testIds = {
  page: 'StopDetailsPage::page',
  validityPeriod: 'StopDetailsPage::validityPeriod',
};

export const StopDetailsPage = (): JSX.Element => {
  const { stopDetails } = useGetStopDetails();
  const { t } = useTranslation();

  if (!stopDetails) {
    return <></>;
  }

  return (
    <Container testId={testIds.page}>
      <StopTitleRow stopDetails={stopDetails} />
      <StopHeaderSummaryRow className="my-2" stopDetails={stopDetails} />
      <hr className="my-4" />
      <div className="flex items-center">
        <h2 className="">{t('stopDetails.stopDetails')}</h2>
        <div
          className="ml-4"
          title={t('accessibility:stops.validityPeriod')}
          data-testid={testIds.validityPeriod}
        >
          {mapToShortDate(stopDetails.validity_start)}
          <span className="mx-1">-</span>
          {mapToShortDate(stopDetails.validity_end)}
        </div>
      </div>
      {/* TODO: tabs. */}
      <BasicDetailsSection stop={stopDetails} />
      <LocationDetailsSection stop={stopDetails} />
      <SignageDetailsSection stop={stopDetails} />
    </Container>
  );
};
