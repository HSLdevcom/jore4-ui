import {
  HslRouteTransportTargetEnum,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
} from '../generated/graphql';
import { i18n } from '../i18n';
import { Priority, TimetablePriority } from '../types/enums';
import { RouteDirection } from '../types/RouteDirection';
import { AllOptionEnum } from '../utils';

export const mapPriorityToUiName = (key: Priority) => {
  const uiStrings: Record<Priority, string> = {
    [Priority.Standard]: i18n.t('priority.standard'),
    [Priority.Temporary]: i18n.t('priority.temporary'),
    [Priority.Draft]: i18n.t('priority.draft'),
  };
  return uiStrings[key];
};

export const mapTimetablePriorityToUiName = (key: TimetablePriority) => {
  const uiStrings: Record<TimetablePriority, string> = {
    [TimetablePriority.Standard]: i18n.t('priority.standard'),
    [TimetablePriority.Temporary]: i18n.t('priority.temporary'),
    [TimetablePriority.Draft]: i18n.t('priority.draft'),
    [TimetablePriority.Special]: i18n.t('priority.special'),
    [TimetablePriority.Staging]: '', // NOTE: staging priorities are not intented to be shown in UI
  };
  return uiStrings[key];
};

export const mapVehicleModeToUiName = (
  key: ReusableComponentsVehicleModeEnum | AllOptionEnum.All,
) => i18n.t(key === AllOptionEnum.All ? 'all' : `vehicleModeEnum.${key}`);

export const mapLineTypeToUiName = (
  key: RouteTypeOfLineEnum | AllOptionEnum.All,
) => i18n.t(key === AllOptionEnum.All ? 'all' : `lineTypeEnum.${key}`);

export const mapDirectionToUiName = (key: RouteDirection) =>
  i18n.t(`directionEnum.${key}`);

export const mapTransportTargetToUiName = (key: HslRouteTransportTargetEnum) =>
  i18n.t(`transportTargetEnum.${key}`);

export const mapDirectionToShortUiName = (
  direction?: RouteDirection | RouteDirectionEnum,
) => (direction === RouteDirectionEnum.Outbound ? '1' : '2');
