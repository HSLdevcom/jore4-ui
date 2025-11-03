import { TFunction } from 'i18next';
import { CSVWriter } from '../../../../common/ReportWriter/CSVWriter';
import { EnrichedStopDetails, ReportSectionInstantiator } from '../types';

export function writeHeaderArray(
  writer: CSVWriter,
  headers: ReadonlyArray<(t: TFunction) => string>,
) {
  headers.forEach((header) => {
    writer.writeTextField(header(writer.t));
  });
}

export function writeGivenMetaHeadersAtStart(
  writer: CSVWriter,
  metaHeaders: ReadonlyArray<(t: TFunction) => string>,
  fieldCount: number,
) {
  metaHeaders.forEach((header) => {
    writer.writeTextField(header(writer.t).toLocaleUpperCase());
  });
  writer.writeEmptyFields(fieldCount - metaHeaders.length);
}

export function staticSection(
  metaHeaders: ReadonlyArray<(t: TFunction) => string>,
  headers: ReadonlyArray<(t: TFunction) => string>,
  writeRecordFields: (writer: CSVWriter, record: EnrichedStopDetails) => void,
  shouldHavePadding: boolean = true,
): ReportSectionInstantiator {
  return {
    forDataset: () => ({
      fieldCount: headers.length,
      shouldHavePadding,
      writeMetaHeaders(writer: CSVWriter) {
        writeGivenMetaHeadersAtStart(writer, metaHeaders, headers.length);
      },
      writeHeader(writer: CSVWriter) {
        writeHeaderArray(writer, headers);
      },
      writeRecordFields,
    }),
  };
}

export function dynamicSection(
  forDataset: ReportSectionInstantiator['forDataset'],
): ReportSectionInstantiator {
  return { forDataset };
}
