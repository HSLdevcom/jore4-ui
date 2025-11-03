import { TFunction } from 'i18next';
import { mapStopPlaceSignTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { staticSection } from './utils';

const metaHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.signs.title'),
];

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.signs.signType'),
  (t) => t('stopDetails.signs.numberOfFrames'),
  (t) => t('stopDetails.signs.signageInstructionExceptions'),
  (t) => t('stopDetails.signs.replacesRailSign'),
];

function writeRecordFields(
  writer: CSVWriter,
  { quay }: EnrichedStopDetails,
): void {
  const { t } = writer;
  const sign = quay.placeEquipments?.generalSign?.at(0);

  if (!sign) {
    return writer.writeEmptyFields(headers.length);
  }

  writer.writeEnumField(
    sign.privateCode?.value as StopPlaceSignType,
    mapStopPlaceSignTypeToUiName,
  );
  writer.writeNumberField(sign.numberOfFrames);
  writer.writeTextField(sign.note?.value);
  writer.writeBooleanField(
    sign.replacesRailSign,
    t('stopDetails.signs.replacesRailSign'),
  );

  return undefined;
}

export const SignageDetailsSection = staticSection(
  metaHeaders,
  headers,
  writeRecordFields,
);
