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

export function staticSection<
  StopDetails extends EnrichedStopDetails = EnrichedStopDetails,
>(
  metaHeaders: ReadonlyArray<(t: TFunction) => string>,
  headers: ReadonlyArray<(t: TFunction) => string>,
  writeRecordFields: (writer: CSVWriter, record: StopDetails) => void,
  shouldHavePadding: boolean = true,
): ReportSectionInstantiator<StopDetails> {
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

export function dynamicSection<
  StopDetails extends EnrichedStopDetails = EnrichedStopDetails,
>(
  forDataset: ReportSectionInstantiator<StopDetails>['forDataset'],
): ReportSectionInstantiator<StopDetails> {
  return { forDataset };
}
