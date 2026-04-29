import { useCallback, useState } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  StopRegistryKeyValuesInput,
  StopRegistryQuayInput,
  useInsertQuayIntoStopPlaceMutation,
  useInsertStopPointMutation,
} from '../../../../../generated/graphql';
import { Operation } from '../../../../../redux';
import { StopWithDetails } from '../../../../../types';
import { KnownValueKey } from '../../../../../utils';
import { useLoader } from '../../../../common/hooks';
import { useGetStopLinkAndDirection } from '../../../../map/stops/hooks/useGetStopLinkAndDirection';
import { setMirrorParent } from '../../../utils/mirrorRelation';

type CreateMirrorQuayParams = {
  readonly targetStopPlaceId: string;
  readonly parentStop: StopWithDetails;
  readonly vehicleMode: ReusableComponentsVehicleModeEnum;
};

const keysToInherit: ReadonlyArray<string> = [
  KnownValueKey.Priority,
  KnownValueKey.ValidityStart,
  KnownValueKey.ValidityEnd,
  KnownValueKey.StopState,
];

function buildQuayInput(parentStop: StopWithDetails): StopRegistryQuayInput {
  const { quay } = parentStop;
  if (!quay) {
    throw new Error('Parent stop has no quay');
  }

  const inheritedKeyValues = (quay.keyValues ?? []).flatMap((kv) => {
    if (kv?.key && keysToInherit.includes(kv.key)) {
      return [{ key: kv.key, values: [...(kv.values ?? [])] }];
    }
    return [];
  });

  const keyValues = [
    ...setMirrorParent([], quay.id ?? ''),
    ...inheritedKeyValues,
  ];

  return {
    geometry:
      quay.geometry?.coordinates && quay.geometry.type
        ? { coordinates: quay.geometry.coordinates, type: quay.geometry.type }
        : undefined,
    publicCode: quay.publicCode,
    description: quay.description
      ? { lang: quay.description.lang, value: quay.description.value }
      : undefined,
    alternativeNames: quay.alternativeNames
      ?.filter((an): an is NonNullable<typeof an> => an !== null)
      .map((an) => ({
        nameType: an.nameType,
        name: { lang: an.name.lang, value: an.name.value },
      })),
    keyValues: keyValues as StopRegistryKeyValuesInput[],
  };
}

type QuayWithKeyValues = {
  readonly id?: string | null;
  readonly keyValues?: ReadonlyArray<{
    readonly key?: string | null;
    readonly values?: ReadonlyArray<string | null> | null;
  } | null> | null;
};

function findNewChildQuayId(
  quays: ReadonlyArray<QuayWithKeyValues | null> | null,
  parentQuayNetexId: string,
): string | null {
  const child = quays?.find((q) =>
    q?.keyValues?.some(
      (kv) =>
        kv?.key === KnownValueKey.Mirrors &&
        kv?.values?.includes(parentQuayNetexId),
    ),
  );
  return child?.id ?? null;
}

export function useCreateMirrorQuay() {
  const [loading, setLoading] = useState(false);
  const { setIsLoading } = useLoader(Operation.CreateMirrorQuay);

  const [insertQuayIntoStopPlace] = useInsertQuayIntoStopPlaceMutation({
    refetchQueries: ['GetStopDetails'],
    awaitRefetchQueries: true,
  });

  const [insertStopPoint] = useInsertStopPointMutation();
  const [getStopLinkAndDirection] = useGetStopLinkAndDirection();

  const createMirrorQuay = useCallback(
    async ({
      targetStopPlaceId,
      parentStop,
      vehicleMode,
    }: CreateMirrorQuayParams) => {
      const parentQuayId = parentStop.quay?.id;
      const parentStopPlaceId = parentStop.stop_place?.id;
      if (!parentQuayId || !parentStopPlaceId) {
        return false;
      }

      setLoading(true);
      setIsLoading(true);
      try {
        // Resolve infra link first — if this fails, no orphan quay is created
        const { closestLink, direction } = await getStopLinkAndDirection({
          stopLocation: parentStop.measured_location,
          vehicleMode,
        });

        const quayInput = buildQuayInput(parentStop);

        const insertResponse = await insertQuayIntoStopPlace({
          variables: {
            stopPlaceId: targetStopPlaceId,
            quayInput,
          },
        });

        const resultQuays =
          insertResponse.data?.stop_registry?.mutateStopPlace?.at(0)?.quays;
        const childQuayId = findNewChildQuayId(
          resultQuays ?? null,
          parentQuayId,
        );

        if (!childQuayId) {
          throw new Error('Could not find newly created child quay');
        }

        const stopPointInput = {
          measured_location: parentStop.measured_location,
          located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
          direction,
          label: parentStop.label,
          priority: parentStop.priority,
          validity_start: parentStop.validity_start,
          validity_end: parentStop.validity_end,
          timing_place_id: parentStop.timing_place_id,
          stop_place_ref: childQuayId,
          vehicle_mode_on_scheduled_stop_point: {
            data: [{ vehicle_mode: vehicleMode }],
          },
        };

        await insertStopPoint({
          variables: { stopPoint: stopPointInput },
        });

        return true;
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    },
    [
      insertQuayIntoStopPlace,
      insertStopPoint,
      getStopLinkAndDirection,
      setIsLoading,
    ],
  );

  return { createMirrorQuay, loading };
}
