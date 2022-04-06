import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteTypeOfLineEnum,
} from '../generated/graphql';
import { i18n } from '../i18n';
import { Priority } from '../types/Priority';
import { RouteDirection } from '../types/RouteDirection';

export const mapPriorityToUiName = (key: Priority) => {
  const uiStrings: Record<Priority, string> = {
    [Priority.Standard]: i18n.t('priority.standard'),
    [Priority.Temporary]: i18n.t('priority.temporary'),
    [Priority.Draft]: i18n.t('priority.draft'),
  };
  return uiStrings[key];
};

export const mapVehicleModeToUiName = (
  key: ReusableComponentsVehicleModeEnum,
) => i18n.t(`vehicleModeEnum.${key}`);

export const mapLineTypeToUiName = (key: RouteTypeOfLineEnum) =>
  i18n.t(`lineTypeEnum.${key}`);

export const mapDirectionToUiName = (key: RouteDirection) =>
  i18n.t(`directionEnum.${key}`);

export const mapTransportTargetToUiName = (key: HslRouteTransportTargetEnum) =>
  i18n.t(`transportTargetEnum.${key}`);
