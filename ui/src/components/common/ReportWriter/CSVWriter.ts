/* eslint-disable max-classes-per-file */
import { TFunction } from 'i18next';
import { Translatable, TranslationMapper } from '../../../i18n/uiNameMappings';
import { DateLike, mapToShortDate } from '../../../time';

const mimeType = 'text/csv';

const fieldSeparator = ',';

const recordSeparator = '\r\f';

const quoteChar = '"';
const escapedQuote = '""';

const quoteRegexp = new RegExp(quoteChar, 'g');

function escapeString(str: string | null | undefined): string {
  const clean = str?.trim() ?? '';

  if (clean === '') {
    return '';
  }

  if (
    clean.includes(fieldSeparator) ||
    clean.includes(recordSeparator) ||
    clean.includes(quoteChar)
  ) {
    return `"${clean.replace(quoteRegexp, escapedQuote)}"`;
  }

  return clean;
}

export class CSVError extends Error {}

export class CSVWriter {
  private readonly t: TFunction;

  private closed: boolean = false;

  private currentRecordWidth: number = 0;

  private currentRecord: string = '';

  private expectedRecordWidth: number = 0;

  private finalDataUrl: string | null = null;

  private records: Array<string> = [];

  constructor(t: TFunction);
  constructor(t: TFunction, expectedRecordWidth: number);
  constructor(t: TFunction, expectedRecordWidth?: number) {
    this.t = t;
    this.expectedRecordWidth = expectedRecordWidth ?? Number.NaN;
  }

  private writeField(content: string) {
    this.currentRecord += content;
    this.currentRecord += fieldSeparator;
    this.currentRecordWidth += 1;
  }

  writeBooleanField(
    value: boolean | null | undefined,
    trueOption: string = this.t('yes'),
  ) {
    switch (value) {
      case true:
        return this.writeField(escapeString(trueOption));

      case false:
        return this.writeField(escapeString(this.t('no')));

      default:
        return this.writeField('');
    }
  }

  writeDateField(value: DateLike | null | undefined) {
    this.writeField(mapToShortDate(value) ?? '');
  }

  writeEmptyField() {
    this.writeField('');
  }

  writeEmptyFields(count: number = 1) {
    for (let i = 0; i < count; i += 1) {
      this.writeField('');
    }
  }

  writeEnumField<EnumT extends Translatable>(
    value: EnumT | null | undefined,
    mapper: TranslationMapper<EnumT>,
  ) {
    const content = value ? mapper(this.t, value) : '';
    this.writeField(escapeString(content));
  }

  writeNumberField(value: number | null | undefined) {
    if (Number.isFinite(value)) {
      this.writeField((value as number).toString(10));
    } else {
      this.writeEmptyField();
    }
  }

  writeTextField(value: string | null | undefined) {
    this.writeField(escapeString(value));
  }

  closeRecord() {
    // We should know the record width
    if (this.records.length > 0) {
      if (this.currentRecordWidth !== this.expectedRecordWidth) {
        throw new CSVError(
          `Expected a record of width ${this.expectedRecordWidth}, but ${this.currentRecordWidth} fields were provided! Record: ${this.currentRecord}`,
        );
      }
      // First record, and no expected width provided
    } else if (Number.isNaN(this.expectedRecordWidth)) {
      this.expectedRecordWidth = this.currentRecordWidth;
    }

    this.currentRecord += recordSeparator;
    this.records.push(this.currentRecord);

    this.currentRecord = '';
    this.currentRecordWidth = 0;
  }

  closePartialRecord() {
    if (Number.isNaN(this.expectedRecordWidth)) {
      throw new CSVError(
        'Cannot close a partial record if the expected record width is not known!',
      );
    }

    const neededPadding = this.expectedRecordWidth - this.currentRecordWidth;
    this.writeEmptyFields(neededPadding);

    this.closeRecord();
  }

  closeReport() {
    if (this.closed) {
      throw new CSVError('This report has already been closed!');
    }

    if (this.records.length === 0) {
      throw new CSVError('Nothing written to the report!');
    }

    if (this.currentRecord !== '') {
      throw new CSVError(
        `Unclosed record found! Record: ${this.currentRecord}`,
      );
    }

    this.closed = true;
  }

  download(fileName: string) {
    if (!this.closed) {
      throw new CSVError(
        'Cannot download unfinished report! It has to be closed first!',
      );
    }

    if (this.finalDataUrl === null) {
      const blob = new Blob(this.records, { type: mimeType });
      this.finalDataUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.download = fileName;
    link.href = this.finalDataUrl;
    link.type = mimeType;
    link.click();
  }

  [Symbol.dispose]() {
    if (this.finalDataUrl) {
      URL.revokeObjectURL(this.finalDataUrl);
    }
  }
}
