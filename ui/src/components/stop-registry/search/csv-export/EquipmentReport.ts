import { TFunction } from 'i18next';
import { CSVWriter } from '../../../common/ReportWriter/CSVWriter';
import {
  BasicDetailsSection,
  InfoSpotsSection,
  LocationDetailsSection,
  MaintenanceDetailsSection,
  MeasurementsDetailsSection,
  SheltersSection,
  SignageDetailsSection,
  ValidityDetailsSection,
} from './sections';
import {
  EnrichedStopDetails,
  OnQuaysProcessedProgress,
  ReportContext,
  ReportSection,
  ReportSectionInstantiator,
  TriggerDownloadFn,
} from './types';

export class EquipmentReport {
  // Builders for sections that should be included in the report.
  private static readonly defaultSections: ReadonlyArray<ReportSectionInstantiator> =
    [
      BasicDetailsSection,
      ValidityDetailsSection,
      LocationDetailsSection,
      MaintenanceDetailsSection,
      SignageDetailsSection,
      MeasurementsDetailsSection,
      SheltersSection,
      InfoSpotsSection,
    ];

  private readonly data: ReadonlyArray<EnrichedStopDetails>;

  private readonly sections: ReadonlyArray<ReportSection>;

  private readonly lastSection: ReportSection;

  private readonly writer: CSVWriter;

  constructor(
    t: TFunction,
    data: ReadonlyArray<EnrichedStopDetails>,
    context: ReportContext,
  ) {
    this.data = data;
    this.sections = EquipmentReport.defaultSections.map(({ forDataset }) =>
      forDataset(data, context),
    );
    this.lastSection = this.sections[this.sections.length - 1];
    this.writer = new CSVWriter(t, this.getFieldCount());
  }

  /**
   * Should padding (empty field) be added after and a section as been written.
   * Added if the section should have one, but not if it is the last section in
   * the report.
   *
   * @param section
   * @private
   */
  private applyPadding(section: ReportSection): boolean {
    return section.shouldHavePadding && section !== this.lastSection;
  }

  /**
   * Total field count of each row, actual data fields + paddings.
   * @private
   */
  private getFieldCount() {
    const actualFields = this.sections.reduce(
      (count, section) => count + section.fieldCount,
      0,
    );

    const paddings = this.sections.filter((section) =>
      this.applyPadding(section),
    ).length;

    return actualFields + paddings;
  }

  /**
   * Write the meta headers from each section in order.
   * @private
   */
  private writeMetaHeaders() {
    this.sections.forEach((section) => {
      section.writeMetaHeaders(this.writer);
      if (this.applyPadding(section)) {
        this.writer.writeEmptyField();
      }
    });
    this.writer.closeRecord();
  }

  /**
   * Write the headers from each section in order.
   * @private
   */
  private writeHeders() {
    this.sections.forEach((section) => {
      section.writeHeader(this.writer);
      if (this.applyPadding(section)) {
        this.writer.writeEmptyField();
      }
    });
    this.writer.closeRecord();
  }

  /**
   * Write records between [offset, offset+batchSize[ from the dataset on to
   * the record.
   *
   * @param batchSize Max amount of records to write, or until end of data
   * @param offset Index of the 1st record to write.
   * @private
   */
  private writeBatchOfRecords(batchSize: number, offset: number): number {
    const writeCount = Math.min(batchSize, this.data.length - offset);

    for (let i = 0; i < writeCount; i += 1) {
      const record = this.data[offset + i];
      this.sections.forEach((section) => {
        section.writeRecordFields(this.writer, record);
        if (this.applyPadding(section)) {
          this.writer.writeEmptyField();
        }
      });
      this.writer.closePartialRecord();
    }

    return writeCount;
  }

  /**
   * Initialize the asynchronous record writing batch job chain.
   *
   * @param abortSignal Abort controller to see if the Async task has been cancelled
   * @param onProgress Progress event listener
   * @private
   */
  private writeRecords(
    abortSignal: AbortSignal,
    onProgress: OnQuaysProcessedProgress,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const batchSize = 100;

      const scheduleMacroTaskIfNotAborted = (task: () => void) => {
        if (abortSignal.aborted) {
          reject(
            new Error(
              'The asynchronous Report generation task has been aborted!',
              { cause: abortSignal.reason },
            ),
          );
          return;
        }
        setTimeout(task);
      };

      const createRecordWritingBatchJob = (offset: number) => {
        try {
          if (offset < this.data.length) {
            const writeCount = this.writeBatchOfRecords(batchSize, offset);

            onProgress(offset + writeCount);

            scheduleMacroTaskIfNotAborted(() =>
              createRecordWritingBatchJob(offset + batchSize),
            );
          } else {
            this.writer.closeReport();
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      };

      scheduleMacroTaskIfNotAborted(() => createRecordWritingBatchJob(0));
    });
  }

  /**
   * Trigger the async process to transform the associated data into CSV format.
   *
   * @param abortSignal
   * @param onProgress
   */
  async generate(
    abortSignal: AbortSignal,
    onProgress: OnQuaysProcessedProgress,
  ): Promise<TriggerDownloadFn> {
    if (this.writer.isClosed()) {
      throw new Error(
        'The CSVWriter has already been closed, i.e. the report has already been generated!',
      );
    }

    this.writeMetaHeaders();
    this.writeHeders();

    await this.writeRecords(abortSignal, onProgress);

    return (filename: string) => this.writer.download(filename);
  }

  [Symbol.dispose]() {
    this.writer[Symbol.dispose]();
  }
}
