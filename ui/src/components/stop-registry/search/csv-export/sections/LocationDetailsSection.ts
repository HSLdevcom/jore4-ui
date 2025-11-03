import { TFunction } from 'i18next';
import { mapSignContentTypeToUiName } from '../../../../../i18n/uiNameMappings';
import { getPointPosition } from '../../../../../utils';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { staticSection } from './utils';

const metaHeaders: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.location.title'),
];

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.location.streetAddress'),
  (t) => t('stopDetails.location.postalCode'),
  (t) => t('stopDetails.location.municipality'),
  (t) => t('stopDetails.location.fareZone'),

  (t) => t('stopDetails.location.latitude'),
  (t) => t('stopDetails.location.longitude'),
  (t) => t('stopDetails.location.altitude'),
  (t) => t('stopDetails.location.functionalArea'),

  (t) => t('stopDetails.location.platformNumber'),
  (t) => t('stopDetails.location.signContentType'),

  (t) => t('stopDetails.location.memberPlatforms'),
];

function writeRecordFields(
  writer: CSVWriter,
  { quay, stopPlace }: EnrichedStopDetails,
) {
  writer.writeTextField(quay.streetAddress);
  writer.writeTextField(quay.postalCode);
  writer.writeTextField(stopPlace.municipality);
  writer.writeTextField(stopPlace.fareZone);

  const position = getPointPosition(quay.geometry);
  writer.writeNumberField(position?.at(1));
  writer.writeNumberField(position?.at(0));
  writer.writeNumberField(position?.at(2));
  writer.writeNumberField(quay.functionalArea);

  const sign = quay.placeEquipments?.generalSign?.at(0);
  writer.writeTextField(sign?.content?.value);
  writer.writeEnumField(sign?.signContentType, mapSignContentTypeToUiName);

  // TODO: Member platforms
  writer.writeEmptyField();
}

export const LocationDetailsSection = staticSection(
  metaHeaders,
  headers,
  writeRecordFields,
);
