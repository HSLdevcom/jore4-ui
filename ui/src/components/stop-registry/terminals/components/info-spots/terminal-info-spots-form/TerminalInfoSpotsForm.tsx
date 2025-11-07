import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../../types';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { PosterState } from '../../../../stops/stop-details/info-spots/types';
import { TerminalInfoSpotFormState, terminalInfoSpotSchema } from '../types';
import { TerminalInfoSpotFormFields } from './TerminalInfoSpotsFormFields';

const testIds = {
  infoSpot: 'TerminalInfoSpotsForm::infoSpot',
};

type TerminalInfoSpotsFormProps = {
  readonly className?: string;
  readonly defaultValues: TerminalInfoSpotFormState;
  readonly infoSpot?: InfoSpotDetailsFragment;
  readonly setFormIsDirty?: (val: boolean) => void;
  readonly onSubmit: (state: TerminalInfoSpotFormState) => void;
  readonly terminal: EnrichedParentStopPlace;
};

const TerminalInfoSpotsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalInfoSpotsFormProps
> = (
  { className, defaultValues, setFormIsDirty, onSubmit, terminal, infoSpot },
  ref,
) => {
  const methods = useForm<TerminalInfoSpotFormState>({
    defaultValues,
    resolver: zodResolver(terminalInfoSpotSchema),
  });
  const { setValue, getValues, handleSubmit, formState } = methods;
  useDirtyFormBlockNavigation(formState, 'TerminalInfoSpotsForm');
  const { isDirty } = formState;

  const addNewPoster = () => {
    const newPoster: PosterState = {
      size: {
        uiState: 'UNKNOWN',
        width: null,
        height: null,
      },
      label: '',
      lines: '',
      toBeDeletedPoster: false,
      id: window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : Math.random().toString(16).slice(2),
    };

    setValue('poster', [...(getValues('poster') ?? []), newPoster]);
  };

  const onRemoveInfoSpot = () => {
    if (!getValues('infoSpotId')) {
      return;
    }

    const newToBeDeleted = !getValues('toBeDeleted');
    setValue(`toBeDeleted`, newToBeDeleted, {
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
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <div data-testid={testIds.infoSpot} className="mt-0">
          <TerminalInfoSpotFormFields
            infoSpot={infoSpot}
            terminal={terminal}
            onRemove={onRemoveInfoSpot}
            addPoster={addNewPoster}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export const TerminalInfoSpotsForm = forwardRef(TerminalInfoSpotsFormComponent);
