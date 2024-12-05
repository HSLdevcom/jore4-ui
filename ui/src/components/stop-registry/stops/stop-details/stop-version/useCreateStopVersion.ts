import { DateTime } from 'luxon';
import {
  useCreateStopPlaceVersionMutation,
  useInsertStopMutation,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../hooks';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
} from '../../../../../utils';
import {
  CreateStopVersionFormState,
  StopPlaceVersionInputFull,
  StopPointVersionInputFull,
} from './createStopVersionCommon';
import { setValues } from './createStopVersionState';
import {
  mapOriginalToInput,
  updateKeyValues,
} from './stopPlaceToInputMapperUtils';

function mapFormStateToInputs(
  state: CreateStopVersionFormState,
  originalStop: StopWithDetails,
): {
  stopPlaceInput: StopPlaceVersionInputFull;
  stopPointInput: StopPointVersionInputFull;
} {
  const validityStart = mapDateInputToValidityStart(state.validityStart);
  if (!validityStart) {
    throw new Error('Cannot map state with null validityStart');
  }
  const validityEnd: DateTime<true> | null =
    mapDateInputToValidityEnd(state.validityEnd, state.indefinite) ?? null;

  const keyValues = updateKeyValues(
    [
      { key: 'validityStart', values: [validityStart.toISODate()] },
      {
        key: 'validityEnd',
        values: [validityEnd?.toISODate() ?? null],
      },
      { key: 'priority', values: [state.priority.valueOf().toString()] },
    ],
    originalStop.stop_place?.keyValues,
  );

  const stopPlaceInput: StopPlaceVersionInputFull = {
    ...mapOriginalToInput(originalStop),
    id: null,
    versionComment: state.versionName,
    versionDescription: state.versionDescription ?? null, // Not implemented
    keyValues,
  };

  const stopPointInput: StopPointVersionInputFull = {
    ...originalStop,
    scheduled_stop_point_id: null,
    validity_start: validityStart,
    validity_end: validityEnd,
    priority: state.priority.valueOf(),
    stop_place_ref: null,
    direction: originalStop.direction,
    located_on_infrastructure_link_id:
      originalStop.located_on_infrastructure_link_id,
    measured_location: originalStop.measured_location,
  };

  return { stopPlaceInput, stopPointInput };
}

export const useCreateStopVersion = () => {
  const [createStopPlaceVersionMutation] = useCreateStopPlaceVersionMutation();
  const [insertStopMutation] = useInsertStopMutation();

  const openModal = () => {
    setValues({ modalOpen: true });
  };

  const createNewVersion = async (
    state: CreateStopVersionFormState,
    originalStop: StopWithDetails,
  ) => {
    const { stopPlaceInput, stopPointInput } = mapFormStateToInputs(
      state,
      originalStop,
    );

    const response = await createStopPlaceVersionMutation({
      variables: { object: stopPlaceInput },
    });

    // TODO: Update ref to stop point
    const id = response?.data?.stop_registry?.mutateStopPlace?.at(0)?.id;
    await insertStopMutation({
      variables: { object: { ...stopPointInput, stop_place_ref: id } },
    });

  };

  return { setValues, openModal, createNewVersion };
};
