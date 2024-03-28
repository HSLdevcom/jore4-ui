import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { mapStopPlaceSignTypeToUiName } from '../../../../i18n/uiNameMappings';
import { StopPlaceSignType } from '../../../../types/stop-registry';
import { DetailRow } from './DetailRow';
import { LabeledDetail } from './LabeledDetail';
import { optionalBooleanToUiText } from './utils';

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
    <div>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.signs.signType')}
          detail={signType}
        />
        <LabeledDetail
          title={t('stopDetails.signs.numberOfFrames')}
          detail={generalSign?.numberOfFrames?.toString()}
        />
        <LabeledDetail
          title={t('stopDetails.signs.lineSignage')}
          detail={optionalBooleanToUiText(generalSign?.lineSignage)}
        />
        <LabeledDetail
          title={t('stopDetails.signs.signageInstructionExceptions')}
          detail={generalSign?.note?.value}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.signs.replacesRailSign')}
          detail={optionalBooleanToUiText(generalSign?.replacesRailSign)}
        />
        <LabeledDetail
          title={t('stopDetails.signs.mainLineSign')}
          detail={optionalBooleanToUiText(generalSign?.mainLineSign)}
        />
      </DetailRow>
    </div>
  );
};
