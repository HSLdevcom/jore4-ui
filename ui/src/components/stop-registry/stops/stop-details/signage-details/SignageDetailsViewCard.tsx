import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../../hooks';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { DetailRow, LabeledDetail } from '../layout';
import { optionalBooleanToUiText } from '../utils';

const testIds = {
  container: 'SignageDetailsViewCard::container',
  signType: 'SignageDetailsViewCard::signType',
  numberOfFrames: 'SignageDetailsViewCard::numberOfFrames',
  lineSignage: 'SignageDetailsViewCard::lineSignage',
  signageInstructionExceptions:
    'SignageDetailsViewCard::signageInstructionExceptions',
  replacesRailSign: 'SignageDetailsViewCard::replacesRailSign',
  mainLineSign: 'SignageDetailsViewCard::mainLineSign',
};

interface Props {
  stop: StopWithDetails;
}

export const SignageDetailsViewCard = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();

  const generalSign = stop.stop_place?.placeEquipments?.generalSign?.[0];

  const signType =
    generalSign?.privateCode?.value &&
    mapStopPlaceSignTypeToUiName(
      generalSign?.privateCode?.value as StopPlaceSignType,
    );

  return (
    <div data-testid={testIds.container}>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.signs.signType')}
          detail={signType}
          testId={testIds.signType}
        />
        <LabeledDetail
          title={t('stopDetails.signs.numberOfFrames')}
          detail={generalSign?.numberOfFrames?.toString()}
          testId={testIds.numberOfFrames}
        />
        <LabeledDetail
          title={t('stopDetails.signs.signageInstructionExceptions')}
          detail={generalSign?.note?.value}
          testId={testIds.signageInstructionExceptions}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.signs.lineSignage')}
          detail={optionalBooleanToUiText(generalSign?.lineSignage)}
          testId={testIds.lineSignage}
        />
        <LabeledDetail
          title={t('stopDetails.signs.mainLineSign')}
          detail={optionalBooleanToUiText(generalSign?.mainLineSign)}
          testId={testIds.mainLineSign}
        />
        <LabeledDetail
          title={t('stopDetails.signs.replacesRailSign')}
          detail={optionalBooleanToUiText(generalSign?.replacesRailSign)}
          testId={testIds.replacesRailSign}
        />
      </DetailRow>
    </div>
  );
};