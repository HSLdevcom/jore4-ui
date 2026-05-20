import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path, routeDetails } from '../../../../../router/routeDetails';
import { LatestChangeHistoryItem } from '../../../../common/ChangeHistory/latest';
import { LineChangeHistoryItem, LineData } from '../../types';
import { diffLine } from '../../utils';

type LatestLineChangeSectionProps = {
  readonly historyItem: LineChangeHistoryItem;
  readonly currentItemData: LineData;
  readonly previousItemData: LineData;
  readonly label: string;
};

export const LatestLineChangeSection: FC<LatestLineChangeSectionProps> = ({
  historyItem,
  currentItemData,
  previousItemData,
  label,
}) => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t(($) => $.lineChangeHistory.lineSectionTitle, {
        lineLabel: currentItemData.label,
        name: currentItemData.name_i18n.fi_FI,
      }),
      changes: diffLine(t, previousItemData, currentItemData),
    },
  ].filter((it) => it.changes.length > 0);

  return (
    <LatestChangeHistoryItem
      historyItem={historyItem}
      sections={sections}
      link={routeDetails[Path.lineChangeHistory].getLink(label)}
      testId="LatestLineChangeHistoryTable::Item::Diff"
    />
  );
};
