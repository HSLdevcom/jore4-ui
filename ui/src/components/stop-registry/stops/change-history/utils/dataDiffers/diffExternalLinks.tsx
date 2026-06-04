import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  ChangedValue,
  diffKeyedValues,
} from '../../../../../common/ChangeHistory';
import {
  ExternalLink,
  ExternalLinksList,
  formatExternalLinks,
} from '../../../../../common/ChangeHistory/utils/externalLinks';
import { HistoricalStopData } from '../../types';

export function diffStopExternalLinks(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  const formatLinks = (links: readonly (ExternalLink | null)[]) => {
    const formatted = formatExternalLinks(compact(links ?? []));
    return formatted.length === 0
      ? t(($) => $.changeHistory.externalLinks.noExternalLinks)
      : formatted;
  };

  return compact([
    diffKeyedValues({
      key: 'Links',
      field: null,
      oldValue: formatLinks(previous.quay.externalLinks ?? []),
      newValue: formatLinks(current.quay.externalLinks ?? []),
      mapper: (links) =>
        typeof links === 'string' ? (
          links
        ) : (
          <ExternalLinksList links={links} id={current.quay.id ?? undefined} />
        ),
    }),
  ]);
}
