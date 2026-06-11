import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { mapToShortDate, mapToShortDateTime } from '../../../time';
import { statusToCellClasses } from './statusToCellClasses';
import { trStatus } from './trStatus';
import { VersionStatus } from './VersionStatus';

const testIds = {
  status: (prefix: string) => `${prefix}::status`,
  validityStart: (prefix: string) => `${prefix}::validityStart`,
  validityEnd: (prefix: string) => `${prefix}::validityEnd`,
  versionComment: (prefix: string) => `${prefix}::versionComment`,
  changed: (prefix: string) => `${prefix}::changed`,
  changedBy: (prefix: string) => `${prefix}::changedBy`,
};

type VersionWithDisplayFields = {
  readonly status: VersionStatus;
  readonly validity_start: DateTime;
  readonly validity_end: DateTime | null;
  readonly version_comment: string;
  readonly changed: DateTime | string | null;
  readonly changedByUserName: string | null;
};

type VersionRowCellsProps = {
  readonly version: VersionWithDisplayFields;
  readonly testIdPrefix: string;
};

export const VersionRowCells: FC<VersionRowCellsProps> = ({
  version,
  testIdPrefix,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <td
        className={twJoin(
          'border-x px-4 py-2 text-center',
          statusToCellClasses(version.status),
        )}
        data-testid={testIds.status(testIdPrefix)}
      >
        {trStatus(t, version.status)}
      </td>

      <td
        className="border-l px-4 py-2 text-right"
        data-testid={testIds.validityStart(testIdPrefix)}
      >
        {mapToShortDate(version.validity_start)}
      </td>

      <td className="p-0">-</td>

      <td
        className="border-r px-4 py-2 text-right"
        data-testid={testIds.validityEnd(testIdPrefix)}
      >
        {mapToShortDate(version.validity_end)}
      </td>

      <td
        className="border-x px-4 py-2 text-pretty"
        data-testid={testIds.versionComment(testIdPrefix)}
      >
        {version.version_comment}
      </td>

      <td
        className="border-x px-4 py-2 text-center"
        data-testid={testIds.changed(testIdPrefix)}
      >
        {mapToShortDateTime(version.changed)}
      </td>

      <td
        className="border-x px-4 py-2 text-center"
        data-testid={testIds.changedBy(testIdPrefix)}
      >
        {version.changedByUserName ?? 'HSL'}
      </td>
    </>
  );
};
