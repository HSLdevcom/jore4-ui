import { useTranslation } from 'react-i18next';
import { DetailRow, LabeledDetail } from '../../stops/stop-details/layout';

const testIds = {
  nameEng: 'AlternativeNames::nameEng',
  nameLongFin: 'AlternativeNames::nameLongFin',
  nameLongSwe: 'AlternativeNames::nameLongSwe',
  nameLongEng: 'AlternativeNames::nameLongEng',
  abbreviationFin: 'AlternativeNames::abbreviationFin',
  abbreviationSwe: 'AlternativeNames::abbreviationSwe',
  abbreviationEng: 'AlternativeNames::abbreviationEng',
};

type AlternativeNames = {
  readonly nameEng?: string;
  readonly nameLongFin?: string;
  readonly nameLongSwe?: string;
  readonly nameLongEng?: string;
  readonly abbreviationFin?: string;
  readonly abbreviationSwe?: string;
  readonly abbreviationEng?: string;
};

type AlternativeNamesProps = {
  readonly alternativeNames: AlternativeNames;
  readonly className?: string;
};

export const AlternativeNames: React.FC<AlternativeNamesProps> = ({
  alternativeNames,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <DetailRow className={className}>
        <LabeledDetail
          title={t('stopDetails.alternativeNames.nameLongFin')}
          detail={alternativeNames.nameLongFin}
          testId={testIds.nameLongFin}
        />
        <LabeledDetail
          title={t('stopDetails.alternativeNames.nameLongSwe')}
          detail={alternativeNames.nameLongSwe}
          testId={testIds.nameLongSwe}
        />
        <LabeledDetail
          title={t('stopDetails.alternativeNames.abbreviationFin')}
          detail={alternativeNames.abbreviationFin}
          testId={testIds.abbreviationFin}
        />
        <LabeledDetail
          title={t('stopDetails.alternativeNames.abbreviationSwe')}
          detail={alternativeNames.abbreviationSwe}
          testId={testIds.abbreviationSwe}
        />
      </DetailRow>
      <DetailRow className={className}>
        <LabeledDetail
          title={t('stopDetails.alternativeNames.nameEng')}
          detail={alternativeNames.nameEng}
          testId={testIds.nameEng}
        />
        <LabeledDetail
          title={t('stopDetails.alternativeNames.nameLongEng')}
          detail={alternativeNames.nameLongEng}
          testId={testIds.nameLongEng}
        />
        <LabeledDetail
          title={t('stopDetails.alternativeNames.abbreviationEng')}
          detail={alternativeNames.abbreviationEng}
          testId={testIds.abbreviationEng}
        />
      </DetailRow>
    </>
  );
};
