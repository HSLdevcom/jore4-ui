import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StopWithDetails,
  useEditStopSignageDetails,
} from '../../../../../hooks';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { InfoContainer, useInfoContainerControls } from '../../../../common';
import { stopInfoContainerColors } from '../stopInfoContainerColors';
import { SignageDetailsFormState } from './schema';
import { SignageDetailsForm } from './SignageDetailsForm';
import { SignageDetailsViewCard } from './SignageDetailsViewCard';

interface Props {
  stop: StopWithDetails;
}

const mapSignageDetailsToFormState = (
  stop: StopWithDetails,
): Partial<SignageDetailsFormState> => {
  const generalSign = stop.quay?.placeEquipments?.generalSign?.[0];
  const signType = generalSign?.privateCode?.value;

  return {
    signType: signType ? (signType as StopPlaceSignType) : undefined,
    numberOfFrames: generalSign?.numberOfFrames,
    lineSignage: generalSign?.lineSignage,
    replacesRailSign: generalSign?.replacesRailSign,
    mainLineSign: generalSign?.mainLineSign,
    signageInstructionExceptions: generalSign?.note?.value,
  };
};

export const SignageDetailsSection = ({ stop }: Props): React.ReactElement => {
  const { t } = useTranslation();

  const { saveStopPlaceSignageDetails, defaultErrorHandler } =
    useEditStopSignageDetails();

  const formRef = useRef<ExplicitAny>(null);
  const infoContainerControls = useInfoContainerControls({
    isExpandable: true,
    isEditable: true,
    onSave: () => submitFormByRef(formRef),
  });

  const onSubmit = async (state: SignageDetailsFormState) => {
    try {
      await saveStopPlaceSignageDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      infoContainerControls.setIsInEditMode(false);
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapSignageDetailsToFormState(stop);

  return (
    <InfoContainer
      colors={stopInfoContainerColors}
      controls={infoContainerControls}
      title={t('stopDetails.signs.title')}
      testIdPrefix="SignageDetailsSection"
    >
      {infoContainerControls.isInEditMode && !!defaultValues ? (
        <SignageDetailsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
          isMainLineStop={!!stop.quay?.stopType.mainLine}
        />
      ) : (
        <SignageDetailsViewCard stop={stop} />
      )}
    </InfoContainer>
  );
};
