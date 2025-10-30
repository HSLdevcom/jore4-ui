import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';

export abstract class ReportFragment<RecordT> {
  protected readonly writer: CSVWriter;

  protected constructor(writer: CSVWriter) {
    this.writer = writer;
  }

  abstract writeHeader(): void;

  abstract writeRecord(row: RecordT): void;
}
