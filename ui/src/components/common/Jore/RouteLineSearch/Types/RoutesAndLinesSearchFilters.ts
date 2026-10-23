import { z } from 'zod';
import { RouteTypeOfLineEnum } from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import { JoreStopRegistryTransportModeType } from '../../../../../types/stop-registry';
import {
  allEnum,
  instanceOfPlainDate,
  requiredString,
  zEnumArrayWithAll,
} from '../../../Forms';

export const routesAndLinesSearchFiltersSchema = z.object({
  query: requiredString,
  observationDate: instanceOfPlainDate,
  priorities: z.array(z.nativeEnum(Priority)).min(1),
  transportMode: zEnumArrayWithAll(JoreStopRegistryTransportModeType),
  typeOfLine: z.union([z.nativeEnum(RouteTypeOfLineEnum), allEnum]),
});

export type RoutesAndLinesSearchFilters = z.infer<
  typeof routesAndLinesSearchFiltersSchema
>;
