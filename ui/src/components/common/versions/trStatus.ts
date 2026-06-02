import { TFunction } from 'i18next';
import { VersionStatus } from './VersionStatus';

export function trStatus(t: TFunction, status: VersionStatus): string {
  switch (status) {
    case VersionStatus.ACTIVE:
      return t(($) => $.versions.status.active);

    case VersionStatus.STANDARD:
      return t(($) => $.versions.status.standard);

    case VersionStatus.TEMPORARY:
      return t(($) => $.versions.status.temporary);

    case VersionStatus.DRAFT:
      return t(($) => $.versions.status.draft);

    default:
      return '';
  }
}
