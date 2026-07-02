import { VersionStatus } from './VersionStatus';

export function statusToCellClasses(status: VersionStatus): string {
  switch (status) {
    case VersionStatus.ACTIVE:
      return 'bg-hsl-dark-green text-white';

    case VersionStatus.STANDARD:
      return 'bg-tweaked-brand text-white';

    case VersionStatus.TEMPORARY:
      return 'bg-city-bicycle-yellow';

    case VersionStatus.DRAFT:
      return 'bg-background';

    default:
      return '';
  }
}
