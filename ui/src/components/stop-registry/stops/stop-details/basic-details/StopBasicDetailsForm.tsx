import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../../hooks/redux';
import { Visible } from '../../../../../layoutComponents';
import {
  openTimingPlaceModalAction,
  selectIsTimingPlaceModalOpen,
} from '../../../../../redux';
import { FormColumn } from '../../../../forms/common';
import { TimingPlaceModal } from '../../../../forms/stop/TimingPlaceModal';
import { HorizontalSeparator } from '../HorizontalSeparator';
import { StopBasicDetailsFormState, schema } from './schema';
import { StopAbbreviationsFormRow } from './StopAbbreviationsFormRow';
import { StopLabelAndNameFormRow } from './StopLabelAndNameFormRow';
import { StopLongNameAndLocationFormRow } from './StopLongNameAndLocationFormRow';
import { StopOtherDetailsFormRow } from './StopOtherDetailsFormRow';
import { StopTypesFormRow } from './StopTypesFormRow';

interface Props {
  className?: string;
  defaultValues: Partial<StopBasicDetailsFormState>;
  onSubmit: (state: StopBasicDetailsFormState) => void;
}

const StopBasicDetailsFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
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
          <StopLabelAndNameFormRow />
          <HorizontalSeparator />
          <StopLongNameAndLocationFormRow />
          <StopAbbreviationsFormRow />
          <HorizontalSeparator />
          <StopTypesFormRow />
          <StopOtherDetailsFormRow
            onClickOpenTimingSettingsModal={openTimingPlaceModal}
          />
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
