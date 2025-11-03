import { TFunction } from 'i18next';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../../i18n/uiNameMappings';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails } from '../types';
import { dynamicSection, writeHeaderArray } from './utils';

const headers: ReadonlyArray<(t: TFunction) => string> = [
  (t) => t('stopDetails.basicDetails.label'),

  (t) => t('stopDetails.basicAreaDetails.areaName'),
  (t) => t('stopDetails.basicAreaDetails.areaNameSwe'),
  (t) => t('stopDetails.basicAreaDetails.areaNameEng'),

  (t) => t('stopDetails.basicDetails.elyNumber'),
  (t) => t('stopDetails.basicAreaDetails.areaPrivateCode'),
  (t) => t('stopDetails.basicDetails.privateCode'),

  (t) => t('stopDetails.alternativeNames.nameLongFin'),
  (t) => t('stopDetails.alternativeNames.nameLongSwe'),
  (t) => t('stopDetails.alternativeNames.nameLongEng'),

  (t) => t('stopDetails.alternativeNames.abbreviationFin'),
  (t) => t('stopDetails.alternativeNames.abbreviationSwe'),
  (t) => t('stopDetails.alternativeNames.abbreviationEng'),

  (t) => t('stopDetails.basicDetails.locationFin'),
  (t) => t('stopDetails.basicDetails.locationSwe'),

  (t) => t('stopDetails.basicDetails.stopState'),
  (t) => t('stopDetails.basicDetails.transportMode'),
  (t) => t('stops.timingPlaceId'),
  (t) => t('stopPlaceTypes.railReplacement'),
  (t) => t('stopPlaceTypes.virtual'),
];

function writeRecordFields(
  writer: CSVWriter,
  { quay, stopPlace }: EnrichedStopDetails,
) {
  const { t } = writer;

  writer.writeTextField(quay.publicCode);

  writer.writeTextField(stopPlace.name);
  writer.writeTextField(stopPlace.nameSwe);
  writer.writeTextField(stopPlace.nameEng);

  writer.writeTextField(quay.elyNumber);
  writer.writeTextField(stopPlace.privateCode?.value);
  writer.writeTextField(quay.privateCode?.value);

  writer.writeTextField(stopPlace.nameLongFin);
  writer.writeTextField(stopPlace.nameLongSwe);
  writer.writeTextField(stopPlace.nameLongEng);

  writer.writeTextField(stopPlace.abbreviationFin);
  writer.writeTextField(stopPlace.abbreviationSwe);
  writer.writeTextField(stopPlace.abbreviationEng);

  writer.writeTextField(quay.locationFin);
  writer.writeTextField(quay.locationSwe);

  writer.writeEnumField(quay.stopState, mapStopPlaceStateToUiName);
  writer.writeEnumField(
    stopPlace.transportMode,
    mapStopRegistryTransportModeTypeToUiName,
  );
  writer.writeTextField(quay.timingPlace);
  writer.writeBooleanField(
    quay.stopType.railReplacement,
    t('stopPlaceTypes.railReplacement'),
  );
  writer.writeBooleanField(quay.stopType.virtual, t('stopPlaceTypes.virtual'));
}

export const BasicDetailsSection = dynamicSection((_data, context) => ({
  fieldCount: headers.length,
  shouldHavePadding: true,
  writeMetaHeaders(writer: CSVWriter) {
    const { t } = writer;

    writer.writeTextField(
      t('stopDetails.basicDetails.title').toLocaleUpperCase(),
    );
    writer.writeTextField(t('filters.observationDate').toLocaleUpperCase());
    writer.writeDateField(context.observationDate);

    writer.writeEmptyFields(headers.length - 3);
  },
  writeHeader(writer: CSVWriter) {
    writeHeaderArray(writer, headers);
  },
  writeRecordFields,
}));
