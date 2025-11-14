import { EnumLike, z } from 'zod';
import { RouteTypeOfLineEnum } from '../../../../generated/graphql';
import { Priority } from '../../../../types/enums';
import { JoreStopRegistryTransportModeType } from '../../../../types/stop-registry';
import { AllOptionEnum } from '../../../../utils';
import { instanceOfDateTime, requiredString } from '../../../forms/common';

const allEnum = z.nativeEnum(AllOptionEnum);

function zEnumArrayWithAll<Elements extends EnumLike>(values: Elements) {
  return z.array(z.union([z.nativeEnum(values), allEnum]));
}

export const routesAndLinesSearchFiltersSchema = z.object({
  query: requiredString,
  observationDate: instanceOfDateTime,
  priorities: z.array(z.nativeEnum(Priority)).min(1),
  transportMode: zEnumArrayWithAll(JoreStopRegistryTransportModeType),
  typeOfLine: z.union([z.nativeEnum(RouteTypeOfLineEnum), allEnum]),
});

export type RoutesAndLinesSearchFilters = z.infer<
  typeof routesAndLinesSearchFiltersSchema
>;
