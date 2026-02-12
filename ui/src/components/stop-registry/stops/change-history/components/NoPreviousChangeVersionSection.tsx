import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { QuayChangeHistoryItem } from '../../../../../generated/graphql';
import { ChangeHistoryItemSectionHeaderRow } from '../../../../common/ChangeHistory';

const testIds = {
  // These will expand to: ChangeHistory::SectionHeader::${testId}
  importedVersion: 'ImportedVersion',
  createdVersion: 'CreatedVersion',
  copiedVersion: 'CopiedVersion',
};

type ChangeVersionType = 'imported' | 'copied' | 'created';

const copiedVersionsImportedIdRegexp = /HSL:Quay:\d+-\d{4}-\d{2}-\d{2}-\d+/;
function determineType(historyItem: QuayChangeHistoryItem): ChangeVersionType {
  if (historyItem.importedId?.match(copiedVersionsImportedIdRegexp)) {
    return 'copied';
  }

  if (historyItem.privateCodeType === 'HSL/JORE-3') {
    return 'imported';
  }

  return 'created';
}

function getHeadingText(t: TFunction, type: ChangeVersionType): string {
  switch (type) {
    case 'imported':
      return t('stopChangeHistory.importedVersion');
    case 'copied':
      return t('stopChangeHistory.copiedVersion');
    case 'created':
    default:
      return t('stopChangeHistory.firstVersion');
  }
}

function getTestId(type: ChangeVersionType): string {
  switch (type) {
    case 'imported':
      return testIds.importedVersion;
    case 'copied':
      return testIds.copiedVersion;
    case 'created':
    default:
      return testIds.createdVersion;
  }
}

type NoPreviousChangeVersionSectionProps = {
  readonly getUserNameById: (
    userId: string | null | undefined,
  ) => string | null;
  readonly historyItem: QuayChangeHistoryItem;
};

export const NoPreviousChangeVersionSection: FC<
  NoPreviousChangeVersionSectionProps
> = ({ getUserNameById, historyItem }) => {
  const { t } = useTranslation();

  const type = determineType(historyItem);

  return (
    <ChangeHistoryItemSectionHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      sectionTitle={<h5>{getHeadingText(t, type)}</h5>}
      testId={getTestId(type)}
    />
  );
};
