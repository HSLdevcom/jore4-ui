import { TFunction } from 'i18next';
import { StopVersionStatus } from '../types';

export function trStatus(t: TFunction, status: StopVersionStatus): string {
  switch (status) {
    case StopVersionStatus.ACTIVE:
      return t('stopVersion.status.active');

    case StopVersionStatus.STANDARD:
      return t('stopVersion.status.standard');

    case StopVersionStatus.TEMPORARY:
      return t('stopVersion.status.temporary');

    case StopVersionStatus.DRAFT:
      return t('stopVersion.status.draft');

    default:
      return '';
  }
}
