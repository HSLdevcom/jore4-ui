import { TFunction } from 'i18next';
import { mapPriorityToUiName } from '../../../../../i18n/uiNameMappings';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { staticSection } from './utils';

const metaHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopRegistrySearch.csv.metaHeaders.validity'),
];

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('validityPeriod.validityStart'),
  (t) => t('validityPeriod.validityEnd'),
  (t) => t('priority.label'),
];

function writeRecordFields(writer: CSVWriter, { quay }: EnrichedStopDetails) {
  writer.writeDateField(quay.validityStart);
  writer.writeDateField(quay.validityEnd);
  writer.writeEnumField(quay.priority, mapPriorityToUiName);
}

export const ValidityDetailsSection = staticSection(
  metaHeaders,
  headers,
  writeRecordFields,
);
