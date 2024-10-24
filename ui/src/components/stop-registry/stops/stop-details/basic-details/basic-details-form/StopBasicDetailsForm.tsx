import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
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
import { FormColumn } from '../../../../../forms/common';
import { TimingPlaceModal } from '../../../../../forms/stop/TimingPlaceModal';
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
  hasMainLineSign: boolean;
}

const StopBasicDetailsFormComponent = (
  { className = '', defaultValues, onSubmit, hasMainLineSign }: Props,
  ref: ExplicitAny,
): React.ReactElement => {
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
          <StopTypesFormRow hasMainLineSign={hasMainLineSign} />
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
