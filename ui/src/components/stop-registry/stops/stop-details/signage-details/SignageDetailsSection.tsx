import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { StopWithDetails, useToggle } from '../../../../../hooks';
import { useEditStopSignageDetails } from '../../../../../hooks/stop-registry/useEditStopSignageDetails';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { showSuccessToast, submitFormByRef } from '../../../../../utils';
import { ExpandableInfoContainer } from '../layout';
import { SignageDetailsFormState } from './schema';
import { SignageDetailsForm } from './SignageDetailsForm';
import { SignageDetailsViewCard } from './SignageDetailsViewCard';

interface Props {
  stop: StopWithDetails;
}

const mapSignageDetailsToFormState = (
  stop: StopWithDetails,
): Partial<SignageDetailsFormState> => {
  const generalSign = stop.stop_place?.placeEquipments?.generalSign?.[0];
  const signType = generalSign?.privateCode?.value;

  return {
    signType: signType ? (signType as StopPlaceSignType) : undefined,
    numberOfFrames: generalSign?.numberOfFrames ?? undefined,
    lineSignage: generalSign?.lineSignage ?? undefined,
    replacesRailSign: generalSign?.replacesRailSign ?? undefined,
    mainLineSign: generalSign?.mainLineSign ?? undefined,
    signageInstructionExceptions: generalSign?.note?.value ?? undefined,
  };
};

export const SignageDetailsSection = ({ stop }: Props): JSX.Element => {
  const { t } = useTranslation();
  const { saveStopPlaceSignageDetails, defaultErrorHandler } =
    useEditStopSignageDetails();
  const [isExpanded, toggleIsExpanded] = useToggle(true);
  const [isEditMode, toggleEditMode] = useToggle(false);

  const onCancel = () => {
    toggleEditMode();
  };
  const formRef = useRef<ExplicitAny>(null);
  const onSave = () => submitFormByRef(formRef);

  const onSubmit = async (state: SignageDetailsFormState) => {
    try {
      await saveStopPlaceSignageDetails({ state, stop });

      showSuccessToast(t('stops.editSuccess'));
      toggleEditMode();
    } catch (err) {
      defaultErrorHandler(err as Error);
    }
  };

  const defaultValues = mapSignageDetailsToFormState(stop);

  return (
    <ExpandableInfoContainer
      onToggle={toggleIsExpanded}
      isExpanded={isExpanded}
      title={t('stopDetails.signs.title')}
      isEditMode={isEditMode}
      onCancel={onCancel}
      onSave={onSave}
      toggleEditMode={toggleEditMode}
    >
      {isEditMode && !!defaultValues ? (
        <SignageDetailsForm
          defaultValues={defaultValues}
          ref={formRef}
          onSubmit={onSubmit}
        />
      ) : (
        <SignageDetailsViewCard stop={stop} />
      )}
    </ExpandableInfoContainer>
  );
};