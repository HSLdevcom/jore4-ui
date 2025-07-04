import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  StopRegistryKeyValuesInput,
  useEditKeyValuesOfQuayMutation,
  useEditScheduledStopPointValidityMutation,
  useGetQuayLazyQuery,
} from '../../../../../../generated/graphql';
import { StopWithDetails } from '../../../../../../types';
import { QuayKeyValuesEditFailed } from '../errors/QuayKeyValuesEditFailed';
import { ScheduledStopPointEditFailed } from '../errors/ScheduledStopPointEditFailed';
import { StopVersionFormState } from '../types';
import { EditStopVersionResult } from '../types/EditStopVersionResult';
import { wrapErrors } from './wrapErrors';

function useEditcheduledStopPointValidity() {
  const [editScheduledStopPointValidityMutation] =
    useEditScheduledStopPointValidityMutation();

  return useCallback(
    async (
      originalStop: StopWithDetails,
      validityStart: DateTime,
      validityEnd?: DateTime,
      indefinite?: boolean,
    ) => {
      const response = await wrapErrors(
        editScheduledStopPointValidityMutation({
          variables: {
            stopId: originalStop.stop_place_ref as string,
            priority: originalStop.priority, // Don't support changing priority yet
            validityStart,
            validityEnd: validityEnd && !indefinite ? validityEnd : null,
          },
        }),
        ScheduledStopPointEditFailed,
        'Failed to edit validity of scheduled stop point!',
      );
      if (!response.data) {
        throw new ScheduledStopPointEditFailed(
          `Scheduled stop point edit seems to have failed. No data returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      const returning =
        response.data.update_service_pattern_scheduled_stop_point?.returning[0];
      return {
        stopId: returning?.stop_place_ref as string,
        priority: returning?.priority as number,
      };
    },
    [editScheduledStopPointValidityMutation],
  );
}

function useEditQuayValidity() {
  const [editKeyValuesOfQuayMutation] = useEditKeyValuesOfQuayMutation();
  const [getQuay] = useGetQuayLazyQuery();

  return useCallback(
    async (
      originalStop: StopWithDetails,
      versionComment: string,
      validityStart: DateTime,
      validityEnd?: DateTime,
      indefinite?: boolean,
    ) => {
      const { data } = await getQuay({
        variables: { quayId: originalStop.stop_place_ref as string },
      });
      if (
        !data?.stop_registry?.stopPlace ||
        !data?.stop_registry?.stopPlace[0] ||
        // eslint-disable-next-line no-underscore-dangle
        data?.stop_registry?.stopPlace[0].__typename !==
          'stop_registry_StopPlace'
      ) {
        throw new QuayKeyValuesEditFailed(
          `Failed to get stop place for quayId: ${originalStop.stop_place_ref}. Data received: ${JSON.stringify(data)}`,
        );
      }

      const stopPlaceId = data.stop_registry.stopPlace[0].id as string;
      const originalQuay = data.stop_registry.stopPlace[0].quays?.find(
        (q) => q?.id === originalStop.stop_place_ref,
      );

      if (!originalQuay) {
        throw new QuayKeyValuesEditFailed(
          `Failed to find quay with id: ${originalStop.stop_place_ref} in stop place ${stopPlaceId}. Quays: ${JSON.stringify(data.stop_registry.stopPlace[0].quays)}`,
        );
      }

      const keyValues: StopRegistryKeyValuesInput[] =
        originalQuay.keyValues
          ?.filter(
            (kv) =>
              kv && kv.key !== 'validityStart' && kv.key !== 'validityEnd',
          )
          .map((kv) => {
            return { key: kv?.key, values: kv?.values };
          }) ?? [];

      keyValues.push({
        key: 'validityStart',
        values: [validityStart.toISODate()],
      });

      keyValues.push({
        key: 'validityEnd',
        values: [validityEnd && !indefinite ? validityEnd.toISODate() : null],
      });

      const response = await wrapErrors(
        editKeyValuesOfQuayMutation({
          variables: {
            quayId: originalStop.stop_place_ref as string,
            stopId: stopPlaceId,
            keyValues,
            versionComment,
          },
        }),
        QuayKeyValuesEditFailed,
        'Failed to edit validity of quay in stop registry!',
      );
      if (!response.data) {
        throw new QuayKeyValuesEditFailed(
          `Quay key values edit seems to have failed. No data returned. Response: ${JSON.stringify(response, null, 0)}`,
        );
      }

      return { stopPlaceId };
    },
    [editKeyValuesOfQuayMutation, getQuay],
  );
}

export function useEditStopValidity() {
  // TODO: Cut validity of conflicting versions

  const editScheduledStopPointValidity = useEditcheduledStopPointValidity();
  const editQuayValidity = useEditQuayValidity();

  return useCallback(
    async (
      state: StopVersionFormState,
      originalStop: StopWithDetails,
    ): Promise<EditStopVersionResult> => {
      if (!originalStop.stop_place_ref) {
        throw new Error('Stop place ref missing for the quay being edited!');
      }

      const validityStart = DateTime.fromFormat(
        state.validityStart,
        'yyyy-MM-dd',
      );
      const validityEnd = state.validityEnd
        ? DateTime.fromFormat(state.validityEnd, 'yyyy-MM-dd')
        : undefined;

      const { stopId, priority } = await editScheduledStopPointValidity(
        originalStop,
        validityStart,
        validityEnd,
        state.indefinite,
      );
      const { stopPlaceId } = await editQuayValidity(
        originalStop,
        state.versionName,
        validityStart,
        validityEnd,
        state.indefinite,
      );
      return {
        stopPlaceId,
        quayId: stopId,
        priority,
        validityStart,
        validityEnd,
        indefinite: state.indefinite,
      };
    },
    [editQuayValidity, editScheduledStopPointValidity],
  );
}
