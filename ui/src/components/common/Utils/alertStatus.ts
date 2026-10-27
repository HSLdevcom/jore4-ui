import { TFunction } from 'i18next';
import { DateLike } from '../../../time';
import { Priority } from '../../../types/enums';
import { isEndingSoon } from '../../../utils';

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

type AlertStatusInput = {
  readonly priority: Priority;
  readonly validity_end?: DateLike | null | undefined;
  readonly version_comment?: string | null | undefined;
  readonly hasContinuingVersion?: boolean;
};

function getAlertListItemBorder(alert: AlertLevel) {
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
}

function getAlertIcon(alert: AlertLevel) {
  switch (alert) {
    case AlertLevel.Warning:
      return 'icon-temporary text-city-bicycle-yellow';
    case AlertLevel.Important:
      return 'icon-alert text-hsl-red';
    default:
      return undefined;
  }
}

export function getAlertStyle(alert: AlertLevel) {
  return {
    listItemBorder: getAlertListItemBorder(alert),
    icon: getAlertIcon(alert),
  };
}

export function getAlertStatus(
  t: TFunction,
  input: AlertStatusInput,
): AlertStatus {
  // if validity ends within 20 days and nothing continues after it, it's "Important"
  if (isEndingSoon(input.validity_end) && !input.hasContinuingVersion) {
    return {
      alertLevel: AlertLevel.Important,
      title: t(($) => $.alert.important.topic),
      description: t(($) => $.alert.important.description),
    };
  }

  // if priority is temporary, it's "Warning"
  if (input.priority === Priority.Temporary) {
    return {
      alertLevel: AlertLevel.Warning,
      title: t(($) => $.alert.warning.topic),
      description: input.version_comment?.trim() ?? '-',
    };
  }

  // otherwise, it's "Basic"
  return {
    alertLevel: AlertLevel.Basic,
    title: '',
    description: '',
  };
}
