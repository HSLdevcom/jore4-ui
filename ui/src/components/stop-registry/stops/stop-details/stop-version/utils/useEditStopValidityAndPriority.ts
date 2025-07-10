import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  StopRegistryKeyValuesInput,
  useEditKeyValuesOfQuayMutation,
  useEditScheduledStopPointValidityMutation,
  useGetQuayLazyQuery,
} from '../../../../../../generated/graphql';
import { QuayKeyValuesEditFailed } from '../errors/QuayKeyValuesEditFailed';
import { ScheduledStopPointEditFailed } from '../errors/ScheduledStopPointEditFailed';
import { EditStopVersionResult } from '../types/EditStopVersionResult';
import { wrapErrors } from './wrapErrors';

function useEditScheduledStopPointValidityAndPriority() {
  const [editScheduledStopPointValidityMutation] =
    useEditScheduledStopPointValidityMutation();

  return useCallback(
    async (
      quayId: string,
      priority: number,
      validityStart: DateTime,
      validityEnd?: DateTime,
      indefinite?: boolean,
    ) => {
      const response = await wrapErrors(
        editScheduledStopPointValidityMutation({
          variables: {
            stopId: quayId,
            priority,
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
      quayId: string,
      versionComment: string,
      validityStart: DateTime,
      validityEnd?: DateTime,
      indefinite?: boolean,
      reasonForChange?: string,
    ) => {
      const { data } = await getQuay({
        variables: { quayId },
      });
      if (
        !data?.stop_registry?.stopPlace ||
        !data?.stop_registry?.stopPlace[0] ||
        // eslint-disable-next-line no-underscore-dangle
        data?.stop_registry?.stopPlace[0].__typename !==
          'stop_registry_StopPlace'
      ) {
        throw new QuayKeyValuesEditFailed(
          `Failed to get stop place for quayId: ${quayId}. Data received: ${JSON.stringify(data)}`,
        );
      }

      const stopPlaceId = data.stop_registry.stopPlace[0].id as string;
      const originalQuay = data.stop_registry.stopPlace[0].quays?.find(
        (q) => q?.id === quayId,
      );

      if (!originalQuay) {
        throw new QuayKeyValuesEditFailed(
          `Failed to find quay with id: ${quayId} in stop place ${stopPlaceId}. Quays: ${JSON.stringify(data.stop_registry.stopPlace[0].quays)}`,
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

      if (reasonForChange) {
        const existing = keyValues.find((kv) => kv.key === 'reasonForChange');
        if (existing) {
          existing.values = [reasonForChange];
        } else {
          keyValues.push({ key: 'reasonForChange', values: [reasonForChange] });
        }
      }

      const response = await wrapErrors(
        editKeyValuesOfQuayMutation({
          variables: {
            quayId,
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

export function useEditStopValidityAndPriority() {
  const editScheduledStopPointValidityAndPriority =
    useEditScheduledStopPointValidityAndPriority();
  const editQuayValidity = useEditQuayValidity();

  return useCallback(
    async (
      quayId: string | undefined | null,
      versionPriority: number,
      versionName: string,
      validityStart: string,
      validityEnd?: string,
      indefinite?: boolean,
      reasonForChange?: string,
    ): Promise<EditStopVersionResult> => {
      if (!quayId) {
        throw new Error('Stop place ref missing for the quay being edited!');
      }

      const validityStartDateTime = DateTime.fromFormat(
        validityStart,
        'yyyy-MM-dd',
      );
      const validityEndDateTime =
        validityEnd && !indefinite
          ? DateTime.fromFormat(validityEnd, 'yyyy-MM-dd')
          : undefined;

      const { stopId, priority } =
        await editScheduledStopPointValidityAndPriority(
          quayId,
          versionPriority,
          validityStartDateTime,
          validityEndDateTime,
          indefinite,
        );

      const { stopPlaceId } = await editQuayValidity(
        quayId,
        versionName,
        validityStartDateTime,
        validityEndDateTime,
        indefinite,
        reasonForChange,
      );

      return {
        stopPlaceId,
        quayId: stopId,
        priority,
        validityStart: validityStartDateTime,
        validityEnd: validityEndDateTime,
        indefinite: indefinite ?? false,
      };
    },
    [editQuayValidity, editScheduledStopPointValidityAndPriority],
  );
}
