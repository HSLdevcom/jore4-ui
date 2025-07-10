import { DateTime } from 'luxon';
import {
  LineTableRowFragment,
  RouteValidityFragment,
  ScheduledStopPointDefaultFieldsFragment,
} from '../../generated/graphql';
import { parseDate } from '../../time';
import { Priority } from '../../types/enums';

enum AlertLevel {
  NoAlert,
  Basic,
  Warning,
  Important,
}

export type AlertStatus = {
  readonly alertLevel: AlertLevel;
  readonly title: string;
  readonly description: string;
};

export const useAlertsAndHighLights = () => {
  const getAlertStatus = (
    input:
      | RouteValidityFragment
      | LineTableRowFragment
      | ScheduledStopPointDefaultFieldsFragment,
  ): AlertStatus => {
    // TODO: this logic is actually pretty far from the desired functionality, but at least
    // will let us demo the different highlighting

    // if there's less than 20 days until the validity end and is currently valid, it's "Important"
    const validityEnd = parseDate(input.validity_end);
    const now = DateTime.now();
    if (
      validityEnd && // has an end
      validityEnd < now.plus({ days: 20 }) && // end is coming in 20 days
      validityEnd > now // still active
    ) {
      return {
        alertLevel: AlertLevel.Important,
        title: 'alert.important.topic',
        description: 'alert.important.description',
      };
    }

    // if priority is temporary, it's "Warning"
    if (input.priority === Priority.Temporary) {
      return {
        alertLevel: AlertLevel.Warning,
        title: 'alert.warning.topic',
        description: 'alert.warning.description',
      };
    }

    // otherwise, it's "Basic"
    return {
      alertLevel: AlertLevel.Basic,
      title: '',
      description: '',
    };
  };

  const getAlertListItemBorder = (alert: AlertLevel) => {
    switch (alert) {
      case AlertLevel.Basic:
        return 'border-l-10 border-hsl-dark-green';
      case AlertLevel.Warning:
        return 'border-l-10 border-city-bicycle-yellow';
      case AlertLevel.Important:
        return 'border-l-10 border-hsl-red border-l-dashed';
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
    getAlertStatus,
    getAlertStyle,
    getAlertIcon,
    getAlertListItemBorder,
  };
};
