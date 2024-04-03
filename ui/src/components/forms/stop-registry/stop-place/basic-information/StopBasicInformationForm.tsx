import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { useAppSelector } from '../../../../../hooks/redux';
import { StopWithDetails } from '../../../../../hooks/stop-registry/useGetStopDetails';
import { Visible } from '../../../../../layoutComponents';
import {
  openTimingPlaceModalAction,
  selectIsTimingPlaceModalOpen,
} from '../../../../../redux';
import { HorizontalSeparator } from '../../../../stop-registry/stops/stop-details/HorizontalSeparator';
import { FormColumn } from '../../../common';
import { TimingPlaceModal } from '../../../stop/TimingPlaceModal';
import {
  StopLabelAndNameForm,
  stopLabelAndNameSchema,
} from './StopLabelAndNameForm';
import {
  StopLocationAndAbbreviationsForm,
  stopLocationAndAbbreviationsSchema,
} from './StopLocationAndAbbreviationsForm';
import {
  StopOtherDetailsForm,
  stopOtherDetailsSchema,
} from './StopOtherDetailsForm';
import { StopTypesForm, stopTypesSchema } from './StopTypesForm';

// TODO: Now, that everythings cleared up, should this schema actually be here for
// all the fields, and the components could be just "<...FormFields>"
const schema = z
  .object({})
  .merge(stopLabelAndNameSchema)
  .merge(stopTypesSchema)
  .merge(stopLocationAndAbbreviationsSchema)
  .merge(stopOtherDetailsSchema);

export type StopBasicInformationFormState = z.infer<typeof schema>;

// TODO: is this in the right place ? Should I actually export this from the formcomponent?
export const mapStopBasicInformationDataToFormState = (
  stop: StopWithDetails,
) => {
  const formState: Partial<StopBasicInformationFormState> = {
    label: stop.label || '',
    publicCode: stop.stop_place?.publicCode,
    nameFin: stop.stop_place?.nameFin,
    nameSwe: stop.stop_place?.nameSwe,
    locationFin: stop.stop_place?.locationFin,
    locationSwe: stop.stop_place?.locationSwe,
    nameLongFin: stop.stop_place?.nameLongFin,
    nameLongSwe: stop.stop_place?.nameLongSwe,
    abbreviationFin: stop.stop_place?.abbreviationFin,
    abbreviationSwe: stop.stop_place?.abbreviationSwe,
    abbreviation5CharFin: stop.stop_place?.abbreviation5CharFin,
    abbreviation5CharSwe: stop.stop_place?.abbreviation5CharSwe,
    transportMode: stop.stop_place?.transportMode,
    elyNumber: stop.stop_place?.elyNumber,
    timingPlaceId: stop.timing_place_id,
    stopState: stop.stop_place?.stopState,
    stopTypes: stop.stop_place?.stopType,
  };

  return formState;
};

interface Props {
  className?: string;
  defaultValues: Partial<StopBasicInformationFormState>;
  onSubmit: (state: StopBasicInformationFormState) => void;
}

const StopBasicInformationFormComponent = (
  { className = '', defaultValues, onSubmit }: Props,
  ref: ExplicitAny,
): JSX.Element => {
  const dispatch = useDispatch();
  const isTimingPlaceModalOpen = useAppSelector(selectIsTimingPlaceModalOpen);

  const methods = useForm<StopBasicInformationFormState>({
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
          <StopLabelAndNameForm />
          <HorizontalSeparator />
          <StopLocationAndAbbreviationsForm />
          <HorizontalSeparator />
          <StopTypesForm />
          <StopOtherDetailsForm
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

export const StopBasicInformationForm = React.forwardRef(
  StopBasicInformationFormComponent,
);
