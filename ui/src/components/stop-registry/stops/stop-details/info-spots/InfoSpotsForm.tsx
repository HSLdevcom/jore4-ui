import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { HorizontalSeparator, Visible } from '../../../../../layoutComponents';
import { SlimSimpleButton } from '../layout';
import { InfoSpotFormFields } from './InfoSpotsFormFields';
import { InfoSpotsFormState, InfoSpotsFormSchema, mapInfoSpotDataToFormState } from './schema';

const testIds = {
  infoSpot: 'InfoSpotsForm::infoSpot',
  addInfoSpot: 'InfoSpotsForm::addInfoSpot',
};

interface Props {
  className?: string;
  defaultValues: InfoSpotsFormState;
  onSubmit: (state: InfoSpotsFormState) => void;
  onInfoSpotCountChanged: (newInfoSpotCount: number) => void;
}

const InfoSpotsFormComponent = (
  { className = '', defaultValues, onSubmit, onInfoSpotCountChanged }: Props,
  ref: ExplicitAny,
): React.ReactElement => {
  const { t } = useTranslation();
  const methods = useForm<InfoSpotsFormState>({
    defaultValues,
    resolver: zodResolver(InfoSpotsFormSchema),
  });
  const { control, setValue, getValues, handleSubmit } = methods;
  const updateInfoSpotCount = () => {
    const infoSpotCount = getValues('infoSpots').filter(
      (s) => !s.toBeDeleted,
    ).length;
    onInfoSpotCountChanged(infoSpotCount);
  };

  const {
    append,
    fields: infoSpots,
    remove,
  } = useFieldArray({
    control,
    name: 'infoSpots',
  });
  const addNewInfoSpot = () => {
    append(mapInfoSpotDataToFormState({}));
    updateInfoSpotCount();
  };
  const onRemoveInfoSpot = (idx: number) => {
    const infoSpot = infoSpots[idx];
    // A newly added, non persisted infoSpot is deleted immediately.
    // A persisted one is only marked as to be deleted later when saving.
    if (!infoSpot.id) {
      remove(idx);
    } else {
      const newToBeDeleted = !getValues(`infoSpots.${idx}.toBeDeleted`);
      setValue(`infoSpots.${idx}.toBeDeleted`, newToBeDeleted, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    updateInfoSpotCount();
  };
  const isLast = (idx: number) => idx === infoSpots.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={`space-y-4 ${className}`}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {infoSpots.map((infoSpot, idx) => (
          <div key={infoSpot.id} data-testid={testIds.infoSpot}>
            <InfoSpotFormFields index={idx} onRemove={onRemoveInfoSpot} />
            <Visible visible={!isLast(idx)}>
              <HorizontalSeparator className="my-4" />
            </Visible>
          </div>
        ))}
        <SlimSimpleButton testId={testIds.addInfoSpot} onClick={addNewInfoSpot}>
          {t('stopDetails.infoSpots.addInfoSpot')}
        </SlimSimpleButton>
      </form>
    </FormProvider>
  );
};

export const InfoSpotsForm = React.forwardRef(InfoSpotsFormComponent);
