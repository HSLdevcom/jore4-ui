/* eslint-disable max-classes-per-file */
import { TFunction } from 'i18next';
import { Translatable, TranslationMapper } from '../../../i18n/uiNameMappings';
import { DateLike, mapToShortDate } from '../../../time';

// Excel requires BOM to recognize the data as UTF-8, and not try
// to interpret it as windows-1252 data.
const bom = Uint8Array.from([0xef, 0xbb, 0xbf]);

const mimeType = 'text/csv';

// Excel does not recognize comma as a valid separator
const fieldSeparator = ';';

// Excel might support \n, but let's go with the DOS line endings.
// Also, this is recommended by RFC4180.
// https://www.rfc-editor.org/rfc/rfc4180
const recordSeparator = '\r\n';

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
    clean.includes('\r') ||
    clean.includes('\n') ||
    clean.includes(quoteChar)
  ) {
    return `"${clean.replace(quoteRegexp, escapedQuote)}"`;
  }

  return clean;
}

export class CSVError extends Error {}
export class ReportIsEmptyError extends CSVError {}
export class ReportClosedError extends CSVError {}
export class ReportNotClosedError extends CSVError {}
export class InvalidFieldCountError extends CSVError {}
export class RecordWidthNotKnownError extends CSVError {}
export class RecordNotClosedError extends CSVError {}

/**
 * A helper class to inject records (rows of data) and fields (columns)
 * into a (CSV) report file. ';' is used as the field separator,
 * '\r\n' as the record separator (line ending) and '"' quote as the quote
 * character for rich text fields.
 */
export class CSVWriter {
  private readonly t: TFunction;

  /**
   * Has the report been closed aka marked as finished.
   * If true, no further additions to the report are allowed.
   *
   * @private
   */
  private closed: boolean = false;

  /**
   * How many fields should each record have.
   *
   * @private
   */
  private expectedRecordWidth: number = 0;

  /**
   * How many fields (column) have been written into the current record.
   * Gets incremented by writeField() family of methods, and reset to 0
   * by the closeRecord() family of methods.
   *
   * @private
   */
  private currentRecordWidth: number = 0;

  /**
   * Current record (row) under construction. Stringifies fields and field
   * separators get concatenated to this. For the sake of performance, this
   * string should not be accessed other than for basic old style JS ('a' + 'b')
   * concatenation. Accessing the partial string will trigger unnecessary memory
   * allocations. This applies at least to V8 and the Firefox's JS engine.
   *
   * About V8 strings: {@link https://blog.frontend-almanac.com/v8-strings}
   *
   * @private
   */
  private currentRecord: string = '';

  /**
   * The raw CSV data that has been assembled so far, excluding what's under
   * construction in {@link currentRecord} string. Like {@link currentRecord}
   * this string should not be accessed before the report has been finalized
   * and closed.
   *
   * @private
   */
  private records: string = '';

  /**
   * How many records have been written onto the report.
   *
   * @private
   */
  private recordCount: number = 0;

  /**
   * Final DataURL containing the data for download.
   *
   * MDN DataURL: {@link https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static}
   *
   * @private
   */
  private finalDataUrl: string | null = null;

  /**
   * Initialize a CSV Writer with automatic record width (column count),
   * based on the 1st written record (row).
   * All following records need to have the same width.
   *
   * @param t i18n T-function used to translate enum values
   */
  constructor(t: TFunction);
  /**
   * Initialize a CSV Writer with given record width (column count).
   * All following records need to have the given width.
   *
   * @param t I18n T-function used to translate enum values
   * @param expectedRecordWidth Expected width of each record
   */
  constructor(t: TFunction, expectedRecordWidth: number);
  constructor(t: TFunction, expectedRecordWidth?: number) {
    this.t = t;
    this.expectedRecordWidth = expectedRecordWidth ?? Number.NaN;
  }

  /**
   * Pushes the given string into the buffer and begins a new field.
   *
   * @param content string content to write
   * @private
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  private writeField(content: string) {
    if (this.closed) {
      throw new ReportClosedError(
        'The report has already been closed, and no new fields can be written into it!',
      );
    }

    this.currentRecord += content;
    this.currentRecord += fieldSeparator;
    this.currentRecordWidth += 1;
  }

  /**
   * Write a boolean field.
   * - Nullish values count as empty fields.
   * - True is mapped to t('yes'), or to a more fluid value if given.
   * - False is mapped to t('no')
   *
   * @param value possibly nullish boolean value
   * @param trueOption fluid string to map the true value into
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
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

  /**
   * Writes a date like value in the d.m.yyyy format
   *
   * @param value possibly nullish date value
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeDateField(value: DateLike | null | undefined) {
    this.writeField(mapToShortDate(value) ?? '');
  }

  /**
   * Write an empty field.
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeEmptyField() {
    this.writeField('');
  }

  /**
   * Write multiple empty fields.
   *
   * @param count how many fields to "write"
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeEmptyFields(count: number = 1) {
    for (let i = 0; i < count; i += 1) {
      this.writeField('');
    }
  }

  /**
   * Map and write an "enum" based value field
   *
   * @param value possibly nullish value to map
   * @param mapper mapper function to translate the value into user facing string
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeEnumField<EnumT extends Translatable>(
    value: EnumT | null | undefined,
    mapper: TranslationMapper<EnumT>,
  ) {
    const content = value ? mapper(this.t, value) : '';
    this.writeField(escapeString(content));
  }

  /**
   * Write a number field
   * Nullish and nonvalid numeric values (NaN, ∞, −∞) are mapped to empty field.
   *
   * @param value possibly nullish number
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeNumberField(value: number | null | undefined) {
    if (Number.isFinite(value)) {
      this.writeField((value as number).toString(10));
    } else {
      this.writeEmptyField();
    }
  }

  /**
   * Write and, if needed, escape a string and write it as field.
   *
   * @param value possibly nullish value
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   */
  writeTextField(value: string | null | undefined) {
    this.writeField(escapeString(value));
  }

  /**
   * Mark the current record (row) as finished and start a new one.
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   *
   * @throws {@link InvalidFieldCountError}
   * If too few or too many fields were written on the record.
   */
  closeRecord() {
    if (this.closed) {
      throw new ReportClosedError(
        'The report has already been closed, and no new records can be written into it!',
      );
    }

    // We should know the record width
    if (!Number.isNaN(this.expectedRecordWidth)) {
      if (this.currentRecordWidth !== this.expectedRecordWidth) {
        throw new InvalidFieldCountError(
          `Expected a record of width ${this.expectedRecordWidth}, but ${this.currentRecordWidth} fields were provided! Record: ${this.currentRecord}`,
        );
      }
      // First record, and no expected width provided
    } else {
      this.expectedRecordWidth = this.currentRecordWidth;
    }

    this.currentRecord += recordSeparator;

    this.records += this.currentRecord;
    this.recordCount += 1;

    this.currentRecord = '';
    this.currentRecordWidth = 0;
  }

  /**
   * If needed, add empty padding fields to the end of the record, so that it's
   * width matches what's expected. Then mark the current record (row)
   * as finished and start a new one.
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   *
   * @throws {@link RecordWidthNotKnownError}
   * If the writer is in automatic record width detection mode, and this is the
   * 1st record is being written.
   */
  closePartialRecord() {
    if (this.closed) {
      throw new ReportClosedError(
        'The report has already been closed, and no new records can be written into it!',
      );
    }

    if (Number.isNaN(this.expectedRecordWidth)) {
      throw new RecordWidthNotKnownError(
        'Cannot close a partial record if the expected record width is not known!',
      );
    }

    const neededPadding = this.expectedRecordWidth - this.currentRecordWidth;
    this.writeEmptyFields(neededPadding);

    this.closeRecord();
  }

  /**
   * Mark the whole report as finished and close it off for further changes.
   *
   * @throws {@link ReportClosedError}
   * If the report has already been closed.
   *
   * @throws {@link ReportIsEmptyError}
   * If nothing has been written into the report.
   *
   * @throws {@link RecordNotClosedError}
   * If the last record in the document has not been closed.
   */
  closeReport() {
    if (this.closed) {
      throw new ReportClosedError('This report has already been closed!');
    }

    if (this.recordCount === 0) {
      throw new ReportIsEmptyError('Nothing written to the report!');
    }

    if (this.currentRecord !== '') {
      throw new RecordNotClosedError(
        `Unclosed record found! Record: ${this.currentRecord}`,
      );
    }

    this.closed = true;
  }

  /**
   * Trigger a file download of the report under the given name.
   *
   * @param fileName
   *
   * @throws {@link ReportNotClosedError}
   * If the report has not yet been closed.
   */
  download(fileName: string) {
    if (!this.closed) {
      throw new ReportNotClosedError(
        'Cannot download unfinished report! It has to be closed first!',
      );
    }

    if (this.finalDataUrl === null) {
      const blob = new Blob([bom, this.records], { type: mimeType });
      this.finalDataUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.download = fileName;
    link.href = this.finalDataUrl;
    link.type = mimeType;
    link.click();
  }

  /**
   * Free up allocated memory resources.
   */
  [Symbol.dispose]() {
    if (this.finalDataUrl) {
      URL.revokeObjectURL(this.finalDataUrl);
    }
  }
}
