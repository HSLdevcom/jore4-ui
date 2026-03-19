import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { GetUserNameById } from '../../../../hooks';
import { ChangeHistoryItemSectionHeaderRow } from '../../../common/ChangeHistory';
import { LineChangeHistoryItem } from '../types';
import { HistoricalRouteDirectionBadge } from './HistoricalRouteDirectionBadge';
import { VersionComment } from './VersionComment';

const testIds = {
  // These will expand to: ChangeHistory::SectionHeader::${testId}
  insertedLineVersion: 'InsertedLineVersion',
  insertedRouteVersion: 'InsertedRouteVersion',
};

type LineChangeFirstVersionHeaderRowProps = {
  readonly getUserNameById: GetUserNameById;
  readonly historyItem: LineChangeHistoryItem;
};

export const LineChangeFirstVersionHeaderRow: FC<
  LineChangeFirstVersionHeaderRowProps
> = ({ getUserNameById, historyItem }) => {
  const { t } = useTranslation();

  if (historyItem.routeId) {
    return (
      <ChangeHistoryItemSectionHeaderRow
        className="bg-background"
        getUserNameById={getUserNameById}
        historyItem={historyItem}
        sectionTitle={
          <div>
            <h5>
              <Trans
                t={t}
                i18nKey="lineChangeHistory.newRouteVersion"
                components={{
                  Direction: (
                    <HistoricalRouteDirectionBadge item={historyItem} />
                  ),
                }}
                values={historyItem}
              />
            </h5>
            <VersionComment item={historyItem} />
          </div>
        }
        testId={testIds.insertedRouteVersion}
      />
    );
  }

  return (
    <ChangeHistoryItemSectionHeaderRow
      getUserNameById={getUserNameById}
      historyItem={historyItem}
      sectionTitle={
        <div>
          <h5>{t('lineChangeHistory.newLineVersion', historyItem)}</h5>
          <VersionComment item={historyItem} />
        </div>
      }
      testId={testIds.insertedLineVersion}
    />
  );
};
