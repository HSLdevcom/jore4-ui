import { gql, useApolloClient } from '@apollo/client';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  GetStopWithRouteGraphDataByIdDocument,
  GetStopWithRouteGraphDataByIdQuery,
  GetStopWithRouteGraphDataByIdQueryVariables,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointSetInput,
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  useEditStopMutation,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../types';
import {
  InternalError,
  KnownValueKey,
  TimingPlaceRequiredError,
  defaultTo,
  illegalOptionalCast,
  patchAlternativeNames,
  patchKeyValues,
  showDangerToast,
} from '../../../../../utils';
import { useValidateTimingSettings } from '../../../../map/Stops/hooks/useValidateTimingSettings';
import { decodeQuayPrivateCodeType } from '../../../utils/decodeQuayPrivateCodeType';
import { getQuayIdsFromStopExcept } from '../useGetStopDetails';
import { StopBasicDetailsFormState } from './basic-details-form/schema';

type EditRoutesAndLinesParams = {
  readonly stopId: UUID;
  readonly state: StopBasicDetailsFormState;
};

// TODO: Go through this. Some of it can be deleted, but realised that the label name change conflicts are currently
// not handled here and they should. (just by changing the label should remove the stop from routes it is being used by)
type EditRoutesAndLinesChanges = {
  readonly stopId: UUID;
  readonly stopLabel: string;
  readonly patch: ServicePatternScheduledStopPointSetInput;
  readonly editedStop: ServicePatternScheduledStopPoint;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
  readonly deleteStopFromJourneyPatternIds?: ReadonlyArray<UUID>;
  readonly conflicts?: ReadonlyArray<ServicePatternScheduledStopPoint>;
};

type EditTiamatParams = {
  readonly state: StopBasicDetailsFormState;
  readonly stop: StopWithDetails;
};

const GQL_UPDATE_STOP_PLACE = gql`
  mutation UpdateStopPlace($input: stop_registry_StopPlaceInput!) {
    stop_registry {
      mutateStopPlace(StopPlace: $input) {
        ...StopPlaceDetails
      }
    }
  }
`;

function mapFormStateToRoutesAndLinesDbInput(state: StopBasicDetailsFormState) {
  return {
    label: state.label,
    timing_place_id: state.timingPlaceId,
  };
}

function mapEditChangesToRoutesAndLinesDbVariables(
  changes: EditRoutesAndLinesChanges,
) {
  const variables: EditStopMutationVariables = {
    stop_id: changes.stopId,
    stop_label: changes.stopLabel,
    stop_patch: changes.patch,
    delete_from_journey_pattern_ids:
      changes.deleteStopFromJourneyPatternIds ?? [],
  };
  return { variables };
}

function mapStopEditChangesToTiamatDbInput({
  state,
  stop,
}: EditTiamatParams): StopRegistryStopPlaceInput {
  const stopPlaceId = stop.stop_place?.id;
  const stopPlaceQuayId = stop.stop_place_ref;

  const otherQuays = getQuayIdsFromStopExcept(stop, stopPlaceQuayId);

  return {
    id: stopPlaceId,
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
        name: { lang: 'fin', value: state.abbreviationFin },
        nameType: StopRegistryNameType.Other,
      },
      {
        name: { lang: 'swe', value: state.abbreviationSwe },
        nameType: StopRegistryNameType.Other,
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
    keyValues: patchKeyValues(stop.stop_place, [
      {
        key: KnownValueKey.ValidityStart,
        values: stop.validity_start ? [stop.validity_start.toISODate()] : [],
      },
      {
        key: KnownValueKey.ValidityEnd,
        values: stop.validity_end ? [stop.validity_end.toISODate()] : [],
      },
    ]),
    quays: [
      ...otherQuays,
      {
        publicCode: state.label,
        privateCode: {
          value: state.privateCode,
          type: decodeQuayPrivateCodeType(state.privateCode),
        },
        id: stopPlaceQuayId,
        description: { value: state.locationFin, lang: 'fin' },
        alternativeNames: patchAlternativeNames(stop.stop_place, [
          {
            name: { lang: 'swe', value: state.locationSwe },
            nameType: StopRegistryNameType.Other,
          },
        ]),
        keyValues: patchKeyValues(stop.quay, [
          {
            key: KnownValueKey.RailReplacement,
            values: state.stopTypes.railReplacement
              ? [state.stopTypes.railReplacement.toString()]
              : [],
          },
          {
            key: KnownValueKey.Virtual,
            values: state.stopTypes.virtual
              ? [state.stopTypes.virtual.toString()]
              : [],
          },
          {
            key: KnownValueKey.TrunkLineStop,
            values: state.stopTypes.trunkLineStop
              ? [state.stopTypes.trunkLineStop.toString()]
              : [],
          },
          {
            key: KnownValueKey.SpeedTramStop,
            values: state.stopTypes.speedTramStop
              ? [state.stopTypes.speedTramStop.toString()]
              : [],
          },
          {
            key: KnownValueKey.ElyNumber,
            values: state.elyNumber ? [state.elyNumber] : [],
          },
          {
            key: KnownValueKey.StopState,
            values: state.stopState ? [state.stopState] : [],
          },
          {
            key: KnownValueKey.TimingPlaceId,
            values: state.timingPlaceId ? [state.timingPlaceId] : [],
          },
        ]),
        versionComment: state.reasonForChange,
      },
    ],
    transportMode: state.transportMode,
  };
}

export function usePrepareEditForRoutesAndLinesDb() {
  const apollo = useApolloClient();

  const [validateTimingSettings] = useValidateTimingSettings();

  // prepare variables for mutation and validate if it's even allowed
  // try to produce a changeset that can be displayed on an explanatory UI
  return async ({ stopId, state }: EditRoutesAndLinesParams) => {
    const patch = mapFormStateToRoutesAndLinesDbInput(state);
    const stopWithRoutesResult = await apollo.query<
      GetStopWithRouteGraphDataByIdQuery,
      GetStopWithRouteGraphDataByIdQueryVariables
    >({ query: GetStopWithRouteGraphDataByIdDocument, variables: { stopId } });
    const stopWithRouteGraphData =
      illegalOptionalCast<ServicePatternScheduledStopPoint>(
        stopWithRoutesResult.data.service_pattern_scheduled_stop_point.at(0),
      );

    if (!stopWithRouteGraphData) {
      throw new InternalError(`Could not find stop with id ${stopId}`);
    }

    const stopLabel = defaultTo(patch.label, stopWithRouteGraphData.label);

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
}

export function useEditStopBasicDetails() {
  const { t } = useTranslation();

  const [editStopMutation] = useEditStopMutation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const prepareEditForRoutesAndLinesDb = usePrepareEditForRoutesAndLinesDb();

  const updateRoutesAndLinesStop = async (
    editParams: EditRoutesAndLinesParams,
  ) => {
    const changesToRoutesAndLinesDb =
      await prepareEditForRoutesAndLinesDb(editParams);
    const variablesForRoutesAndLinesDb =
      mapEditChangesToRoutesAndLinesDbVariables(changesToRoutesAndLinesDb);
    await editStopMutation(variablesForRoutesAndLinesDb);
  };

  const updateTiamatStopPlace = ({ state, stop }: EditTiamatParams) =>
    updateStopPlaceMutation({
      variables: {
        input: mapStopEditChangesToTiamatDbInput({
          state,
          stop,
        }),
      },
      refetchQueries: [
        'GetStopDetails',
        'GetLatestQuayChange',
        'GetStopChangeHistory',
      ],
    });

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
        t(($) => $.stops.timingPlaceRequired, {
          routeLabels: err.message,
        }),
      );
      return;
    }
    // if other error happened, show the generic error message
    showDangerToast(`${t(($) => $.errors.saveFailed)}, ${err}`);
  };

  return {
    saveStopPlaceDetails,
    defaultErrorHandler,
  };
}
