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
import { FormActionButtons } from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { InfoSpotsFormSchema, InfoSpotsFormState } from '../types';
import {
  defaultInfoSpotValues,
  getInfoSpotLabel,
  mapInfoSpotDataToFormState,
} from '../utils';
import { InfoSpotFormFields } from './InfoSpotsFormFields';

const testIds = {
  infoSpot: 'InfoSpotsForm::infoSpot',
  addInfoSpot: 'InfoSpotsForm::addInfoSpot',
  deleteInfoSpot: 'InfoSpotsForm::deleteInfoSpot',
};

type InfoSpotsFormProps = {
  readonly className?: string;
  readonly stopLabel: string;
  readonly defaultValues: InfoSpotsFormState;
  readonly infoSpotsData: ReadonlyArray<InfoSpotDetailsFragment>;
  readonly formRef: RefObject<HTMLFormElement>;
  readonly onSubmit: (state: InfoSpotsFormState) => void;
  readonly infoSpotLocations: (string | null)[];
  readonly setFormIsDirty?: (val: boolean) => void;
  readonly onCancel: () => void;
  readonly testIdPrefix: string;
  readonly addNewButton?: React.ReactNode;
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
    stopLabel,
    defaultValues,
    infoSpotsData,
    infoSpotLocations,
    onSubmit,
    formRef,
    setFormIsDirty,
    onCancel,
    testIdPrefix,
    addNewButton,
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
    move,
  } = useFieldArray({
    control,
    name: 'infoSpots',
  });

  const addNewInfoSpot = () => {
    append(
      mapInfoSpotDataToFormState({
        infoSpotLocations,
        label: getInfoSpotLabel(stopLabel, infoSpots.length),
        ...defaultInfoSpotValues,
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

  const onMoveInfoSpotUp = (idx: number) => {
    if (idx > 0) {
      move(idx, idx - 1);
    }
  };

  const onMoveInfoSpotDown = (idx: number) => {
    if (idx < infoSpots.length - 1) {
      move(idx, idx + 1);
    }
  };

  useEffect(() => {
    if (setFormIsDirty) {
      setFormIsDirty(isDirty);
    }
  }, [isDirty, setFormIsDirty]);

  const hasNewInfoSpot = getValues('infoSpots').some(
    (infoSpot) => !infoSpot.infoSpotId,
  );

  // Form is considered dirty if there are unsaved changes or if a new info spot has been added
  const hasChanges = isDirty || hasNewInfoSpot;

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
              onMoveUp={onMoveInfoSpotUp}
              onMoveDown={onMoveInfoSpotDown}
              isFirst={idx === 0}
              isLast={idx === infoSpots.length - 1}
              totalCount={infoSpots.length}
            />
          </div>
        ))}
        <FormActionButtons
          onCancel={onCancel}
          testIdPrefix={testIdPrefix}
          isDisabled={!hasChanges || methods.formState.isSubmitting}
          isSubmitting={methods.formState.isSubmitting}
          addNewButton={addNewButton}
          variant="infoContainer"
          className="mx-0 my-0"
        />
      </form>
    </FormProvider>
  );
};

export const InfoSpotsForm = forwardRef<InfoSpotsFormRef, InfoSpotsFormProps>(
  InfoSpotsFormComponent,
);
