import {
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import { AllOptionEnum } from '../../../../../utils';

export type SearchConditions = {
  readonly priorities: ReadonlyArray<Priority>;
  readonly query: string;
  readonly transportMode?: ReadonlyArray<
    ReusableComponentsVehicleModeEnum | AllOptionEnum
  >;
  readonly typeOfLine?: RouteTypeOfLineEnum | AllOptionEnum;
  readonly observationDate: Temporal.PlainDate;
};
