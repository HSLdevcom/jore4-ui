import { zodResolver } from '@hookform/resolvers/zod';
import React, { ForwardRefRenderFunction } from 'react';
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
  readonly hasMainLineSign: boolean;
  readonly stop: StopWithDetails;
};

const StopBasicDetailsFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  StopBasicDetailsFormComponentProps
> = (
  { className = '', defaultValues, onSubmit, hasMainLineSign, stop },
  ref,
) => {
  const dispatch = useDispatch();
  const isTimingPlaceModalOpen = useAppSelector(selectIsTimingPlaceModalOpen);

  const methods = useForm<StopBasicDetailsFormState>({
    defaultValues,
    resolver: zodResolver(schema),
  });
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
          <StopTypesFormRow hasMainLineSign={hasMainLineSign} />
        </FormColumn>
      </form>
      <Visible visible={isTimingPlaceModalOpen}>
        <TimingPlaceModal onTimingPlaceCreated={onTimingPlaceCreated} />
      </Visible>
    </FormProvider>
  );
};

export const StopBasicDetailsForm = React.forwardRef(
  StopBasicDetailsFormComponent,
);
