import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../../hooks/redux';
import {
  HorizontalSeparator,
  Visible,
} from '../../../../../../layoutComponents';
import {
  openTimingPlaceModalAction,
  selectIsTimingPlaceModalOpen,
} from '../../../../../../redux';
import { StopWithDetails } from '../../../../../../types';
import { FormColumn } from '../../../../../forms/common';
import { useDirtyFormBlockNavigation } from '../../../../../forms/common/NavigationBlocker';
import { TimingPlaceModal } from '../../../../../forms/stop/TimingPlaceModal';
import { StopAreaDetailsSection } from '../BasicDetailsStopAreaFields';
import { StopBasicDetailsFormState, schema } from './schema';
import { StopLabelAndLocationFormRow } from './StopLabelAndLocationFormRow';
import { StopOtherDetailsFormRow } from './StopOtherDetailsFormRow';
import { StopTypesFormRow } from './StopTypesFormRow';

type StopBasicDetailsFormComponentProps = {
  readonly className?: string;
  readonly defaultValues: Partial<StopBasicDetailsFormState>;
  readonly onSubmit: (state: StopBasicDetailsFormState) => void;
  readonly stop: StopWithDetails;
};

const StopBasicDetailsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  StopBasicDetailsFormComponentProps
> = ({ className = '', defaultValues, onSubmit, stop }, ref) => {
  const dispatch = useDispatch();
  const isTimingPlaceModalOpen = useAppSelector(selectIsTimingPlaceModalOpen);

  const methods = useForm<StopBasicDetailsFormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'StopBasicDetailsForm');
  const { handleSubmit } = methods;

  const onTimingPlaceCreated = (timingPlaceId: UUID) => {
    methods.setValue('timingPlaceId', timingPlaceId);
  };

  const openTimingPlaceModal = () => {
    dispatch(openTimingPlaceModalAction());
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form className={className} onSubmit={handleSubmit(onSubmit)} ref={ref}>
        <FormColumn>
          {stop && <StopAreaDetailsSection stop={stop} />}
          <StopLabelAndLocationFormRow />
          <HorizontalSeparator />
          <StopOtherDetailsFormRow
            onClickOpenTimingSettingsModal={openTimingPlaceModal}
          />
          <StopTypesFormRow />
        </FormColumn>
      </form>
      <Visible visible={isTimingPlaceModalOpen}>
        <TimingPlaceModal onTimingPlaceCreated={onTimingPlaceCreated} />
      </Visible>
    </FormProvider>
  );
};

export const StopBasicDetailsForm = forwardRef(StopBasicDetailsFormComponent);
