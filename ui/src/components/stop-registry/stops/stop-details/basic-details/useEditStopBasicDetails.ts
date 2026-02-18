import { gql } from '@apollo/client';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import { useTranslation } from 'react-i18next';
import {
  EditStopMutationVariables,
  RouteUniqueFieldsFragment,
  ServicePatternScheduledStopPoint,
  StopRegistryNameType,
  StopRegistryStopPlaceInput,
  useEditStopMutation,
  useGetStopWithRouteGraphDataByIdLazyQuery,
  useUpdateStopPlaceMutation,
} from '../../../../../generated/graphql';
import {
  PartialScheduledStopPointSetInput,
  mapStopResultToStop,
} from '../../../../../graphql';
import { StopWithDetails } from '../../../../../types';
import {
  InternalError,
  KnownValueKey,
  TimingPlaceRequiredError,
  defaultTo,
  patchAlternativeNames,
  patchKeyValues,
  showDangerToast,
} from '../../../../../utils';
import { useValidateTimingSettings } from '../../../../map/stops/hooks/useValidateTimingSettings';
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
  readonly patch: PartialScheduledStopPointSetInput;
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
    useGetStopWithRouteGraphDataByIdLazyQuery();
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
    const stopWithRoutesResult = await getStopWithRouteGraphData({
      variables: { stopId },
    });
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
        changes.deleteStopFromJourneyPatternIds ?? [],
    };
    return { variables };
  };

  const updateRoutesAndLinesStop = async (
    editParams: EditRoutesAndLinesParams,
  ) => {
    const changesToRoutesAndLinesDb =
      await prepareEditForRoutesAndLinesDb(editParams);
    const variablesForRoutesAndLinesDb =
      mapEditChangesToRoutesAndLinesDbVariables(changesToRoutesAndLinesDb);
    await editStopMutation(variablesForRoutesAndLinesDb);
  };

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams): StopRegistryStopPlaceInput => {
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
                ? [state.stopTypes.railReplacement?.toString()]
                : [],
            },
            {
              key: KnownValueKey.Virtual,
              values: state.stopTypes.virtual
                ? [state.stopTypes.virtual?.toString()]
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
      refetchQueries: ['GetStopDetails', 'GetLatestQuayChange'],
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
