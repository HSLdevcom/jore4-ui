import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
} from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
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

type InfoSpotsFormProps = {
  readonly className?: string;
  readonly defaultValues: InfoSpotsFormState;
  readonly infoSpotsData: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly formRef: React.RefObject<HTMLFormElement>;
  readonly onSubmit: (state: InfoSpotsFormState) => void;
  readonly infoSpotLocations: (string | null)[];
};

export type InfoSpotsFormRef = {
  readonly addNewInfoSpot: () => void;
};

const InfoSpotsFormComponent: ForwardRefRenderFunction<
  InfoSpotsFormRef,
  InfoSpotsFormProps
> = (
  {
    className,
    defaultValues,
    infoSpotsData,
    infoSpotLocations,
    onSubmit,
    formRef,
  },
  ref,
) => {
  const formElementRef = useRef<HTMLFormElement | null>(null);

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

  useImperativeHandle(ref, () => ({
    addNewInfoSpot,
    submit: () => {
      formElementRef.current?.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      );
    },
  }));

  const addNewPoster = (infoSpotIndex: number) => {
    const newPoster = {
      posterSize: null,
      label: '',
      lines: '',
      toBeDeletedPoster: false,
    };

    setValue(`infoSpots.${infoSpotIndex}.poster`, [
      ...(getValues(`infoSpots.${infoSpotIndex}.poster`) ?? []),
      newPoster,
    ]);
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

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        {infoSpots.map((infoSpot, idx) => (
          <div
            key={infoSpot.id}
            data-testid={testIds.infoSpot}
            className="mt-0"
          >
            <InfoSpotFormFields
              infoSpotIndex={idx}
              infoSpotsData={infoSpotsData}
              onRemove={onRemoveInfoSpot}
              addPoster={addNewPoster}
            />
          </div>
        ))}
      </form>
    </FormProvider>
  );
};

export const InfoSpotsForm = React.forwardRef<
  InfoSpotsFormRef,
  InfoSpotsFormProps
>(InfoSpotsFormComponent);
