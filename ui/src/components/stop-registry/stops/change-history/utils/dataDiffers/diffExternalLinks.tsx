import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import {
  ChangedValue,
  diffKeyedValues,
} from '../../../../../common/ChangeHistory';
import {
  ExternalLinksList,
  formatLinks,
} from '../../../../../common/ChangeHistory/utils/externalLinks';
import { HistoricalStopData } from '../../types';

export function diffStopExternalLinks(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  return compact([
    diffKeyedValues({
      key: 'Links',
      field: null,
      oldValue: formatLinks(previous.quay.externalLinks, t),
      newValue: formatLinks(current.quay.externalLinks, t),
      mapper: (links) =>
        typeof links === 'string' ? (
          links
        ) : (
          <ExternalLinksList links={links} id={current.quay.id ?? undefined} />
        ),
    }),
  ]);
}
