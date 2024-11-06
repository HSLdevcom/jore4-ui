import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  HorizontalSeparator,
  Visible,
} from '../../../../../../layoutComponents';
import { SlimSimpleButton } from '../../layout';
import { InfoSpotFormFields } from './InfoSpotsFormFields';
import {
  InfoSpotsFormSchema,
  InfoSpotsFormState,
  mapInfoSpotDataToFormState,
} from './schema';

const testIds = {
  infoSpot: 'InfoSpotsForm::infoSpot',
  addInfoSpot: 'InfoSpotsForm::addInfoSpot',
  deleteInfoSpot: 'InfoSpotsForm::deleteInfoSpot',
};

type Props = {
  readonly className?: string;
  readonly defaultValues: InfoSpotsFormState;
  readonly onSubmit: (state: InfoSpotsFormState) => void;
  readonly infoSpotLocations: (string | null)[];
};

const InfoSpotsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  Props
> = ({ className, defaultValues, infoSpotLocations, onSubmit }, ref) => {
  const { t } = useTranslation();

  const methods = useForm<InfoSpotsFormState>({
    defaultValues,
    resolver: zodResolver(InfoSpotsFormSchema),
  });
  const { control, setValue, getValues, handleSubmit } = methods;

  const {
    append,
    fields: infoSpots,
    remove,
  } = useFieldArray({
    control,
    name: 'infoSpots',
  });

  const addNewInfoSpot = () => {
    append(
      mapInfoSpotDataToFormState({
        infoSpotLocations,
      }),
    );
  };
  const onRemoveInfoSpot = (idx: number) => {
    const infoSpot = infoSpots[idx];
    if (!infoSpot.infoSpotId) {
      remove(idx);
      return;
    }

    const newToBeDeleted = !getValues(`infoSpots.${idx}.toBeDeleted`);
    setValue(`infoSpots.${idx}.toBeDeleted`, newToBeDeleted, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const isLast = (idx: number) => idx === infoSpots.length - 1;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={twMerge('space-y-4', className)}
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
