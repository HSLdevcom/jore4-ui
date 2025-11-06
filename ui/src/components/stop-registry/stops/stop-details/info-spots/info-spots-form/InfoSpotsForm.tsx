import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForwardRefRenderFunction,
  RefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { InfoSpotsFormSchema, InfoSpotsFormState, PosterState } from '../types';
import { mapInfoSpotDataToFormState } from '../utils';
import { InfoSpotFormFields } from './InfoSpotsFormFields';

const testIds = {
  infoSpot: 'InfoSpotsForm::infoSpot',
  addInfoSpot: 'InfoSpotsForm::addInfoSpot',
  deleteInfoSpot: 'InfoSpotsForm::deleteInfoSpot',
};

type InfoSpotsFormProps = {
  readonly className?: string;
  readonly defaultValues: InfoSpotsFormState;
  readonly infoSpotsData: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly formRef: RefObject<HTMLFormElement>;
  readonly onSubmit: (state: InfoSpotsFormState) => void;
  readonly infoSpotLocations: (string | null)[];
  readonly setFormIsDirty?: (val: boolean) => void;
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
    setFormIsDirty,
  },
  ref,
) => {
  const formElementRef = useRef<HTMLFormElement | null>(null);

  const methods = useForm<InfoSpotsFormState>({
    defaultValues,
    resolver: zodResolver(InfoSpotsFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'InfoSpotsForm');
  const { formState, control, setValue, getValues, handleSubmit } = methods;
  const { isDirty } = formState;

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
    const newPoster: PosterState = {
      size: {
        uiState: 'UNKNOWN',
        width: null,
        height: null,
      },
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

  useEffect(() => {
    if (setFormIsDirty) {
      setFormIsDirty(isDirty);
    }
  }, [isDirty, setFormIsDirty]);

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

export const InfoSpotsForm = forwardRef<InfoSpotsFormRef, InfoSpotsFormProps>(
  InfoSpotsFormComponent,
);
