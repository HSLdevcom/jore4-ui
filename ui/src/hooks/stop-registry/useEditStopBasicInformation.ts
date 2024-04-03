import { gql } from '@apollo/client';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { StopBasicInformationFormState } from '../../components/forms/stop-registry/stop-place/basic-information/StopBasicInformationForm';
import {
  EditStopMutationVariables,
  StopRegistryAlternativeName,
  StopRegistryInterchangeWeightingType,
  StopRegistryKeyValues,
  StopRegistryNameType,
  StopRegistrySubmodeType,
  useEditStopMutation,
  useGetStopWithRouteGraphDataByIdAsyncQuery,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import { mapStopResultToStop } from '../../graphql';
import { setIsMoveStopModeEnabledAction } from '../../redux';
import {
  InternalError,
  TimingPlaceRequiredError,
  defaultTo,
  setMultipleAlternativeNames,
  setMultipleKeyValues,
  showDangerToast,
} from '../../utils';
import { EditChanges } from '../stops/useEditStop';
import { useValidateTimingSettings } from '../stops/useValidateTimingSettings';

interface EditRoutesAndLinesParams {
  stopId: UUID;
  state: StopBasicInformationFormState;
}

interface EditTiamatParams {
  state: StopBasicInformationFormState;
  id?: string | null;
  stopPlaceQuayId?: string | null;
  initialKeyValues?: (StopRegistryKeyValues | null)[];
  initialAlternativeNames?: (StopRegistryAlternativeName | null)[];
  initialAlternativeQuayNames?: (StopRegistryAlternativeName | null)[];
}

const GQL_UPDATE_STOP_PLACE = gql`
  mutation UpdateStopPlace($input: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $input) {
        ...stop_place_details
      }
    }
  }
`;

export const useEditStopBasicInformation = () => {
  const { t } = useTranslation();
  // TODO: Should we use the existing editStopMutation or create one for this one specifically?
  const [editStopMutation] = useEditStopMutation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdAsyncQuery();
  const [validateTimingSettings] = useValidateTimingSettings();
  const dispatch = useDispatch();

  const mapFormStateToRoutesAndLinesDbInput = (
    state: StopBasicInformationFormState,
  ) => {
    const input = {
      label: state.label,
      timing_place_id: state.timingPlaceId,
    };
    return input;
  };

  const mapStopEditChangesToTiamatDbInput = (
    state: StopBasicInformationFormState,
    stopPlaceId: string | null | undefined,
    stopPlaceQuayId: string | null | undefined,
    initialKeyValues?: (StopRegistryKeyValues | null)[],
    initialAlternativeNames?: (StopRegistryAlternativeName | null)[],
    initialQuayAlternativeNames?: (StopRegistryAlternativeName | null)[],
  ) => {
    const combinedKeyValues = setMultipleKeyValues(initialKeyValues, [
      { key: 'stopState', values: [state.stopState.toString()] },
      { key: 'mainLine', values: [state.stopTypes.mainLine.toString()] },
      { key: 'virtual', values: [state.stopTypes.virtual.toString()] },
    ]);

    const combinedAlternativeNames = setMultipleAlternativeNames(
      initialAlternativeNames,
      [
        {
          name: { lang: 'swe', value: state.nameSwe },
          nameType: StopRegistryNameType.Translation,
        },
        {
          name: { lang: 'swe', value: state.locationSwe },
          nameType: StopRegistryNameType.Other,
        },
        {
          name: { lang: 'fin', value: state.abbreviation5CharFin },
          nameType: StopRegistryNameType.Label,
        },
        {
          name: { lang: 'swe', value: state.abbreviation5CharSwe },
          nameType: StopRegistryNameType.Label,
        },
        {
          name: { lang: 'fin', value: state.nameLongFin },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: state.nameLongSwe },
          nameType: StopRegistryNameType.Alias,
        },
      ],
    );

    const combinedQuayAlternativeNames = setMultipleAlternativeNames(
      initialQuayAlternativeNames,
      [
        {
          name: { lang: 'fin', value: state.abbreviationFin },
          nameType: StopRegistryNameType.Alias,
        },
        {
          name: { lang: 'swe', value: state.abbreviationSwe },
          nameType: StopRegistryNameType.Alias,
        },
      ],
    );

    const input = {
      id: stopPlaceId,
      publicCode: state.publicCode,
      privateCode: { value: state.elyNumber, type: 'ELY' },
      name: {
        lang: 'fin',
        value: state.nameFin,
      },
      alternativeNames: combinedAlternativeNames,
      weighting: state.stopTypes.interchange
        ? StopRegistryInterchangeWeightingType.RecommendedInterchange
        : StopRegistryInterchangeWeightingType.NoInterchange,
      submode:
        (state.stopTypes.railReplacement &&
          StopRegistrySubmodeType.RailReplacementBus) ||
        null,
      keyValues: combinedKeyValues,
      description: { lang: 'fin', value: state.locationFin },
      quays: [
        {
          publicCode: state.label,
          id: stopPlaceQuayId,
          alternativeNames: combinedQuayAlternativeNames,
        },
      ],
      transportMode: state.transportMode,
    };

    return input;
  };

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  const prepareEditForRoutesAndLinesDb = async ({
    stopId,
    state,
  }: EditRoutesAndLinesParams) => {
    const patch = mapFormStateToRoutesAndLinesDbInput(state);
    const stopWithRoutesResult = await getStopWithRouteGraphData({ stopId });
    const stopWithRouteGraphData = mapStopResultToStop(stopWithRoutesResult);

    // data model and form validation should ensure that
    // label always exists
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stopLabel = defaultTo(patch.label, stopWithRouteGraphData?.label)!;

    if (!stopWithRouteGraphData) {
      throw new InternalError(`Could not find stop with id ${stopId}`);
    }

    // changes that will always be applied
    const defaultChanges = {
      stopId,
      stopLabel,
      patch,
      deleteStopFromRoutes: [],
      deleteStopFromJourneyPatterns: [],
    };

    // validate stop's timing settings in journey patterns if stop's timing place has been changed
    const newTimingPlaceId = patch.timing_place_id;
    const oldTimingPlaceId = stopWithRouteGraphData.timing_place_id;
    const hasTimingPlaceIdChanged = !isEqual(
      newTimingPlaceId,
      oldTimingPlaceId,
    );

    if (hasTimingPlaceIdChanged) {
      await validateTimingSettings({
        stopLabel,
        timingPlaceId: newTimingPlaceId,
      });
    }

    const mergedChanges = merge({}, defaultChanges);

    const finalChanges: EditChanges = {
      ...mergedChanges,
      // the final state of the stop that will be after patching
      editedStop: merge({}, stopWithRouteGraphData, mergedChanges.patch),
    };
    return finalChanges;
  };

  const prepareEditForTiamatDb = ({
    state,
    id,
    stopPlaceQuayId,
    initialKeyValues,
    initialAlternativeNames,
    initialAlternativeQuayNames,
  }: EditTiamatParams) => {
    return {
      input: mapStopEditChangesToTiamatDbInput(
        state,
        id,
        stopPlaceQuayId,
        initialKeyValues,
        initialAlternativeNames,
        initialAlternativeQuayNames,
      ),
    };
  };

  const mapEditChangesToRoutesAndLinesDbVariables = (changes: EditChanges) => {
    const variables: EditStopMutationVariables = {
      stop_id: changes.stopId,
      stop_label: changes.stopLabel,
      stop_patch: changes.patch,
      // TODO: should this be copypasted with the delete? Basic information changes is not changing the location of the stop
      delete_from_journey_pattern_ids:
        changes.deleteStopFromJourneyPatternIds || [],
    };
    return { variables };
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof TimingPlaceRequiredError) {
      dispatch(setIsMoveStopModeEnabledAction(false));
      showDangerToast(
        t('stops.timingPlaceRequired', { routeLabels: err.message }),
      );
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  const updateRoutesAndLinesStop = async (
    editParams: EditRoutesAndLinesParams,
  ) => {
    const changesToRoutesAndLinesDb = await prepareEditForRoutesAndLinesDb(
      editParams,
    );
    const variablesForRoutesAndLinesDb =
      mapEditChangesToRoutesAndLinesDbVariables(changesToRoutesAndLinesDb);
    await editStopMutation(variablesForRoutesAndLinesDb);
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({ variables: changesToTiamatDb });
  };

  return {
    updateRoutesAndLinesStop,
    updateTiamatStopPlace,
    defaultErrorHandler,
  };
};
