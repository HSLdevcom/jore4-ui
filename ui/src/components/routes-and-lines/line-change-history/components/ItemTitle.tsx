import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { LineChangeHistoryItem } from '../types';
import { HistoricalRouteDirectionBadge } from './HistoricalRouteDirectionBadge';
import { VersionComment } from './VersionComment';

type ItemTitleProps = { readonly item: LineChangeHistoryItem };

export const ItemTitle: FC<ItemTitleProps> = ({ item }) => {
  const { t } = useTranslation();

  if (item.routeId) {
    return (
      <div>
        <h5>
          <Trans
            t={t}
            i18nKey={($) => $.lineChangeHistory.routeSectionTitle}
            components={{
              Direction: <HistoricalRouteDirectionBadge item={item} />,
            }}
            values={item}
          />
        </h5>
        <VersionComment item={item} />
      </div>
    );
  }

  return (
    <div>
      <h5>{t(($) => $.lineChangeHistory.lineSectionTitle, item)}</h5>
      <VersionComment item={item} />
    </div>
  );
};
