import { ForwardRefRenderFunction, forwardRef } from 'react';
import { ReportDownloadMenuItem } from '../../stops/Common/report/ReportDownloadMenuItem';
import { GenerateReport } from '../../stops/Common/report/types';
import { ResultSelection, StopSearchFilters } from '../types';

type DownloadReportMenuItemProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly filters: StopSearchFilters;
  readonly generateReport: GenerateReport;
  readonly genFilename: () => string;
  readonly selection: ResultSelection;
  readonly text: string;
  readonly type: string;
};

const DownloadReportMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  DownloadReportMenuItemProps
> = (
  {
    className,
    disabled,
    filters,
    generateReport,
    genFilename,
    selection,
    text,
    type,
  },
  ref,
) => (
  <ReportDownloadMenuItem
    ref={ref}
    className={className}
    disabled={disabled}
    genFilename={genFilename}
    generate={(filename, saveFileNamePrompt, abortSignal, onProgress) =>
      generateReport(
        filters,
        selection,
        filename,
        saveFileNamePrompt,
        abortSignal,
        onProgress,
      )
    }
    text={text}
    type={type}
  />
);

export const DownloadReportMenuItem = forwardRef(DownloadReportMenuItemImpl);
