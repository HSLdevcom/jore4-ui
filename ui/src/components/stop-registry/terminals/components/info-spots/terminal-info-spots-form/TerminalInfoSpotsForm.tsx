import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
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
  readonly onSubmit: (state: TerminalInfoSpotFormState) => void;
  readonly terminal: EnrichedParentStopPlace;
};

const TerminalInfoSpotsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  TerminalInfoSpotsFormProps
> = ({ className, defaultValues, onSubmit, terminal, infoSpot }, ref) => {
  const methods = useForm<TerminalInfoSpotFormState>({
    defaultValues,
    resolver: zodResolver(terminalInfoSpotSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'TerminalInfoSpotsForm');
  const { setValue, getValues, handleSubmit } = methods;

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
