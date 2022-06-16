import { DateTime } from 'luxon';
import {
  RouteLine,
  RouteRoute,
  ServicePatternScheduledStopPoint,
} from '../../generated/graphql';
import { parseDate } from '../../time';
import { Priority } from '../../types/Priority';

enum AlertLevel {
  NoAlert,
  Basic,
  Warning,
  Important,
}

export const useAlertsAndHighLights = () => {
  const getAlertLevel = (
    input: RouteRoute | RouteLine | ServicePatternScheduledStopPoint,
  ): AlertLevel => {
    // TODO: this logic is actually pretty far from the desired functionality, but at least
    // will let us demo the different highlighting

    // if there's less than 20 days until the validity end, it's "Important"
    const validityEnd = parseDate(input.validity_end);
    if (validityEnd && validityEnd < DateTime.now().plus({ days: 20 })) {
      return AlertLevel.Important;
    }

    // if priority is temporary, it's "Warning"
    if (input.priority === Priority.Temporary) {
      return AlertLevel.Warning;
    }

    // otherwise, it's "Basic"
    return AlertLevel.Basic;
  };

  const getAlertListItemBorder = (alert: AlertLevel) => {
    switch (alert) {
      case AlertLevel.Basic:
        return 'border-l-10 border-hsl-dark-green';
      case AlertLevel.Warning:
        return 'border-l-10 border-city-bicycle-yellow';
      case AlertLevel.Important:
        return 'border-l-10 border-hsl-red border-dashed';
      default:
        return undefined;
    }
  };

  const getAlertIcon = (alert: AlertLevel) => {
    switch (alert) {
      case AlertLevel.Warning:
        return 'icon-temporary text-city-bicycle-yellow';
      case AlertLevel.Important:
        return 'icon-alert text-hsl-red';
      default:
        return undefined;
    }
  };

  const getAlertStyle = (alert: AlertLevel) => ({
    listItemBorder: getAlertListItemBorder(alert),
    icon: getAlertIcon(alert),
  });

  return {
    getAlertLevel,
    getAlertIcon,
    getAlertListItemBorder,
    getAlertStyle,
  };
};
