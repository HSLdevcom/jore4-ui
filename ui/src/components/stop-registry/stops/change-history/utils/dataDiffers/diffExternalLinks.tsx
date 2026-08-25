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
      oldValue: formatLinks(t, previous.quay.externalLinks),
      newValue: formatLinks(t, current.quay.externalLinks),
      mapper: (links) =>
        typeof links === 'string' ? (
          links
        ) : (
          <ExternalLinksList links={links} id={current.quay.id ?? undefined} />
        ),
    }),
  ]);
}
