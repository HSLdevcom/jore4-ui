import { gql } from '@apollo/client';
import { Point } from 'geojson';
import { DateTime } from 'luxon';
import { z } from 'zod';
import {
  InfrastructureNetworkDirectionEnum,
  StopRegistryStopPlaceInput,
} from '../../../../../generated/graphql';
import { ScheduledStopPointSetInput } from '../../../../../graphql';
import {
  priorityFormSchema,
  requiredString,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const createStopVersionSchema = z
  .object({
    stopId: z.string().uuid(),
    versionName: requiredString,
    versionDescription: z.string().optional(), // Not implemented
    indefinite: z.boolean(),
  })
  .merge(validityPeriodFormSchema)
  .merge(priorityFormSchema);

export type CreateStopVersionFormState = z.infer<
  typeof createStopVersionSchema
>;

export const GQL_UPSERT_STOP_PLACE_VERSION = gql`
  mutation CreateStopPlaceVersion($object: stop_registry_StopPlaceInput) {
    stop_registry {
      mutateStopPlace(StopPlace: $object) {
        id
      }
    }
  }
`;

export type StopPlaceKeyValues = {
  validityStart: DateTime;
  validityEnd: DateTime<true> | undefined;
  priority: number;
};

export type StopPlaceVersionInputFull = StopRegistryStopPlaceInput & {
  versionComment: string;
  versionDescription: string | null; // Not implemented
  keyValues: {
    key: keyof StopPlaceKeyValues | string;
    values: Array<string | null>;
  }[];
};

export type StopPointVersionInputFull = ScheduledStopPointSetInput & {
  label: string;
  priority: number;
  validity_start: DateTime;
  validity_end: DateTime | null;
  stop_place_ref: string | null;
  direction: InfrastructureNetworkDirectionEnum;
  located_on_infrastructure_link_id: string;
  measured_location: GeoJSON.Point & Point;
};
