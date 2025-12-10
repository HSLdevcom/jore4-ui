import compact from 'lodash/compact';
import { pick } from 'lodash/fp';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  useEditKeyValuesOfQuayMutation,
  useEditScheduledStopPointValidityMutation,
  useGetQuayLazyQuery,
} from '../../../../../../generated/graphql';
import { setMultipleKeyValues } from '../../../../../../utils';
import { QuayKeyValuesEditFailed } from '../errors/QuayKeyValuesEditFailed';
import { ScheduledStopPointEditFailed } from '../errors/ScheduledStopPointEditFailed';
import { EditStopVersionResult } from '../types/EditStopVersionResult';
import { wrapErrors } from './wrapErrors';

function useEditScheduledStopPointValidityAndPriority() {
  const [editScheduledStopPointValidityMutation] =
    useEditScheduledStopPointValidityMutation({
      refetchQueries: ['GetStopDetails'],
      awaitRefetchQueries: true,
    });

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
  const [editKeyValuesOfQuayMutation] = useEditKeyValuesOfQuayMutation({
    refetchQueries: ['GetStopDetails'],
    awaitRefetchQueries: true,
  });
  const [getQuay] = useGetQuayLazyQuery();

  return useCallback(
    async (
      quayId: string,
      priority: number,
      validityStart: DateTime,
      validityEnd?: DateTime,
      indefinite?: boolean,
      reasonForChange?: string | null,
    ) => {
      const { data } = await getQuay({
        variables: { quayId },
      });
      if (
        !data?.stop_registry?.stopPlace ||
        !data.stop_registry.stopPlace[0] ||
        // eslint-disable-next-line no-underscore-dangle
        data.stop_registry.stopPlace[0].__typename !== 'stop_registry_StopPlace'
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

      const keyValues = setMultipleKeyValues(
        compact(originalQuay.keyValues)
          .filter(
            ({ key }) =>
              !['validityStart', 'validityEnd', 'priority'].includes(
                key as string,
              ),
          )
          .map(pick(['key', 'values'])),
        compact([
          {
            key: 'validityStart',
            values: [validityStart.toISODate()],
          },
          validityEnd && !indefinite
            ? {
                key: 'validityEnd',
                values: [validityEnd.toISODate()],
              }
            : null,
          { key: 'priority', values: [priority.toString()] },
        ]),
      );

      const response = await wrapErrors(
        editKeyValuesOfQuayMutation({
          variables: {
            quayId,
            stopId: stopPlaceId,
            keyValues,
            versionComment: reasonForChange,
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
      priority: number,
      validityStart: string,
      validityEnd?: string,
      indefinite?: boolean,
      reasonForChange?: string | null,
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

      const { stopId, priority: newPriority } =
        await editScheduledStopPointValidityAndPriority(
          quayId,
          priority,
          validityStartDateTime,
          validityEndDateTime,
          indefinite,
        );

      const { stopPlaceId } = await editQuayValidity(
        quayId,
        priority,
        validityStartDateTime,
        validityEndDateTime,
        indefinite,
        reasonForChange,
      );

      return {
        stopPlaceId,
        quayId: stopId,
        priority: newPriority,
        validityStart: validityStartDateTime,
        validityEnd: validityEndDateTime,
        indefinite: indefinite ?? false,
      };
    },
    [editQuayValidity, editScheduledStopPointValidityAndPriority],
  );
}
