import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { StopWithDetails } from '../../../../../types';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { DetailRow, LabeledDetail } from '../layout';
import { MainLineWarning } from '../MainLineWarning';
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

type SignageDetailsViewCardProps = {
  readonly stop: StopWithDetails;
};

export const SignageDetailsViewCard: FC<SignageDetailsViewCardProps> = ({
  stop,
}) => {
  const { t } = useTranslation();

  const generalSign = stop.quay?.placeEquipments?.generalSign?.[0];

  const signType =
    generalSign?.privateCode?.value &&
    mapStopPlaceSignTypeToUiName(
      t,
      generalSign.privateCode.value as StopPlaceSignType,
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
          className="max-w-[500px]"
          detail={generalSign?.note?.value}
          testId={testIds.signageInstructionExceptions}
        />
      </DetailRow>
      <DetailRow>
        <LabeledDetail
          title={t('stopDetails.signs.lineSignage')}
          detail={optionalBooleanToUiText(t, generalSign?.lineSignage)}
          testId={testIds.lineSignage}
        />
        <div className="flex items-center gap-4">
          <LabeledDetail
            title={t('stopDetails.signs.mainLineSign')}
            detail={optionalBooleanToUiText(t, generalSign?.mainLineSign)}
            testId={testIds.mainLineSign}
          />
          <MainLineWarning
            isMainLineStop={!!stop.quay?.stopType.mainLine}
            hasMainLineSign={
              !!stop.quay?.placeEquipments?.generalSign?.[0]?.mainLineSign
            }
          />
        </div>
        <LabeledDetail
          title={t('stopDetails.signs.replacesRailSign')}
          detail={optionalBooleanToUiText(t, generalSign?.replacesRailSign)}
          testId={testIds.replacesRailSign}
        />
      </DetailRow>
    </div>
  );
};
