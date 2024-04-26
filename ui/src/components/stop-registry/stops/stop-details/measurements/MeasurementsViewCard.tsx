import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { DetailRow, LabeledDetail } from '../layout';

const testIds = {
  container: 'MeasurementsViewCard::container',
  streetAddress: 'MeasurementsViewCard::streetAddress',
};

interface Props {
  stop: StopWithDetails;
}

export const MeasurementsViewCard = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.measurements.foo')}
          detail={stop.stop_place?.streetAddress}
          testId={testIds.streetAddress}
        />
      </DetailRow>
    </div>
  );
};
