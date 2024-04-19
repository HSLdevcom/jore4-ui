import { gql } from '@apollo/client';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import { StopBasicDetailsFormState } from '../../components/stop-registry/stops/stop-details/basic-details/basic-details-form/schema';
import {
  EditStopMutationVariables,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  StopRegistryInterchangeWeightingType,
  StopRegistryNameType,
  StopRegistrySubmodeType,
  useEditStopMutation,
  useGetStopWithRouteGraphDataByIdAsyncQuery,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import { ScheduledStopPointSetInput, mapStopResultToStop } from '../../graphql';
import {
  InternalError,
  TimingPlaceRequiredError,
  defaultTo,
  getRequiredStopPlaceMutationProperties,
  patchAlternativeNames,
  patchKeyValues,
  showDangerToast,
} from '../../utils';
import { useValidateTimingSettings } from '../stops/useValidateTimingSettings';
import { StopWithDetails } from './useGetStopDetails';

interface EditRoutesAndLinesParams {
  stopId: UUID;
  state: StopBasicDetailsFormState;
}

// TODO: Go through this. Some of it can be deleted, but realised that the label name change conflicts are currently
// not handled here and they should. (just by changing the label should remove the stop from routes it is being used by)
interface EditRoutesAndLinesChanges {
  stopId: UUID;
  stopLabel: string;
  patch: ScheduledStopPointSetInput;
  editedStop: ServicePatternScheduledStopPoint;
  deleteStopFromRoutes: RouteUniqueFieldsFragment[];
  deleteStopFromJourneyPatternIds?: UUID[];
  conflicts?: ServicePatternScheduledStopPoint[];
}

interface EditTiamatParams {
  state: StopBasicDetailsFormState;
  stop: StopWithDetails;
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

export const useEditStopBasicDetails = () => {
  const { t } = useTranslation();
  const [editStopMutation] = useEditStopMutation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();
  const [getStopWithRouteGraphData] =
    useGetStopWithRouteGraphDataByIdAsyncQuery();
  const [validateTimingSettings] = useValidateTimingSettings();

  const mapFormStateToRoutesAndLinesDbInput = (
    state: StopBasicDetailsFormState,
  ) => {
    const input = {
      label: state.label,
      timing_place_id: state.timingPlaceId,
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

    // changes that will always be applied
    const defaultChanges = {
      stopId,
      stopLabel,
      patch,
      deleteStopFromRoutes: [],
      deleteStopFromJourneyPatterns: [],
    };

    const finalChanges: EditRoutesAndLinesChanges = {
      ...defaultChanges,
      // the final state of the stop that will be after patching
      editedStop: merge({}, stopWithRouteGraphData, defaultChanges.patch),
    };
    return finalChanges;
  };

  const mapEditChangesToRoutesAndLinesDbVariables = (
    changes: EditRoutesAndLinesChanges,
  ) => {
    const variables: EditStopMutationVariables = {
      stop_id: changes.stopId,
      stop_label: changes.stopLabel,
      stop_patch: changes.patch,
      delete_from_journey_pattern_ids:
        changes.deleteStopFromJourneyPatternIds || [],
    };
    return { variables };
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

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceQuayId =
      stop.stop_place?.quays && stop.stop_place?.quays[0]?.id;

    const input = {
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      publicCode: state.publicCode,
      privateCode: { value: state.elyNumber, type: 'ELY' },
      name: {
        lang: 'fin',
        value: state.nameFin,
      },
      alternativeNames: patchAlternativeNames(stop.stop_place, [
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
      ]),
      weighting: state.stopTypes.interchange
        ? StopRegistryInterchangeWeightingType.RecommendedInterchange
        : StopRegistryInterchangeWeightingType.NoInterchange,
      submode:
        (state.stopTypes.railReplacement &&
          StopRegistrySubmodeType.RailReplacementBus) ||
        null,
      keyValues: patchKeyValues(stop.stop_place, [
        { key: 'stopState', values: [state.stopState.toString()] },
        { key: 'mainLine', values: [state.stopTypes.mainLine.toString()] },
        { key: 'virtual', values: [state.stopTypes.virtual.toString()] },
      ]),
      description: { lang: 'fin', value: state.locationFin },
      quays: [
        {
          publicCode: state.label,
          id: stopPlaceQuayId,
          alternativeNames: patchAlternativeNames(stop.stop_place, [
            {
              name: { lang: 'fin', value: state.abbreviationFin },
              nameType: StopRegistryNameType.Alias,
            },
            {
              name: { lang: 'swe', value: state.abbreviationSwe },
              nameType: StopRegistryNameType.Alias,
            },
          ]),
        },
      ],
      transportMode: state.transportMode,
    };

    return input;
  };

  const prepareEditForTiamatDb = ({ state, stop }: EditTiamatParams) => {
    return {
      input: mapStopEditChangesToTiamatDbInput({
        state,
        stop,
      }),
    };
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveStopPlaceDetails = async ({
    state,
    stop,
  }: {
    state: StopBasicDetailsFormState;
    stop: StopWithDetails;
  }) => {
    await updateRoutesAndLinesStop({
      state,
      stopId: stop.scheduled_stop_point_id,
    });

    await updateTiamatStopPlace({
      state,
      stop,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    if (err instanceof TimingPlaceRequiredError) {
      showDangerToast(
        t('stops.timingPlaceRequired', { routeLabels: err.message }),
      );
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  return {
    saveStopPlaceDetails,
    defaultErrorHandler,
  };
};
