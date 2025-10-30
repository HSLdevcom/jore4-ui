/* eslint-disable max-classes-per-file */

import { TFunction } from 'i18next';
import {
  mapStopPlaceStateToUiName,
  mapStopRegistryTransportModeTypeToUiName,
} from '../../../../i18n/uiNameMappings';
import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails, TriggerDownloadFn } from './types';

interface ReportFragment {
  fieldCount: number;
  writeHeader(writer: CSVWriter): void;
  writeRecordFields(writer: CSVWriter, record: EnrichedStopDetails): void;
}

class BasicDetailsSection {
  private static readonly headers: ReadonlyArray<(t: TFunction) => string> = [
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

  static get fieldCount() {
    return this.headers.length;
  }

  static writeHeader(writer: CSVWriter) {
    BasicDetailsSection.headers.forEach((header) => {
      writer.writeTextField(header(writer.t));
    });
  }

  static writeRecordFields(
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
    writer.writeBooleanField(
      quay.stopType.virtual,
      t('stopPlaceTypes.virtual'),
    );
  }
}

export class EquipmentReport {
  private static readonly sections: ReadonlyArray<ReportFragment> = [
    BasicDetailsSection,
  ];

  private readonly t: TFunction;

  private readonly data: ReadonlyArray<EnrichedStopDetails>;

  private readonly writer: CSVWriter;

  private static determineColumnCount(
    data: ReadonlyArray<EnrichedStopDetails>,
  ) {
    return EquipmentReport.sections.reduce(
      (count, section) => count + section.fieldCount,
      0,
    );
  }

  constructor(t: TFunction, data: ReadonlyArray<EnrichedStopDetails>) {
    this.t = t;
    this.data = data;
    this.writer = new CSVWriter(t, EquipmentReport.determineColumnCount(data));
  }

  private writeHeders() {
    EquipmentReport.sections.forEach((section) =>
      section.writeHeader(this.writer),
    );
    this.writer.closeRecord();
  }

  async generate(): Promise<TriggerDownloadFn> {
    const batchSize = 100;

    if (this.writer.isClosed()) {
      throw new Error(
        'The CSVWriter has already been closed, i.e. the report has already been generated!',
      );
    }

    this.writeHeders();

    const recordWritingTask = new Promise<void>((resolve, reject) => {
      const writeBatchedRows = (offset: number) => {
        try {
          if (offset < this.data.length - 1) {
            console.log(
              `Writing rows: ${offset}-${Math.min(offset + batchSize, this.data.length)}`,
            );
            for (let i = offset; i < this.data.length - 1; i += 1) {
              const record = this.data[i];
              EquipmentReport.sections.forEach((section) =>
                section.writeRecordFields(this.writer, record),
              );
              this.writer.closePartialRecord();
            }

            setTimeout(() => writeBatchedRows(offset + batchSize));
          } else {
            console.log(`All rows written, closing report!`);

            this.writer.closeReport();
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      };

      setTimeout(() => writeBatchedRows(0));
    });

    return recordWritingTask.then(
      () => (filename: string) => this.writer.download(filename),
    );
  }

  [Symbol.dispose]() {
    this.writer[Symbol.dispose]();
  }
}
