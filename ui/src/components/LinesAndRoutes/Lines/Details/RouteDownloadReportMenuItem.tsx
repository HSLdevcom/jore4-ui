import { DateTime } from 'luxon';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../generated/graphql';
import { ReportDownloadMenuItem } from '../../../stop-registry/search/components/ReportDownloadMenuItem';
import { GenerateRouteReport } from '../../../stop-registry/search/csv-export/types';

type RouteDownloadReportMenuItemProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly observationDate: DateTime;
  readonly generateReport: GenerateRouteReport;
  readonly genFilename: () => string;
  readonly text: string;
  readonly type: string;
};

const RouteDownloadReportMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  RouteDownloadReportMenuItemProps
> = (
  {
    className,
    disabled,
    route,
    observationDate,
    generateReport,
    genFilename,
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
        route,
        observationDate,
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

export const RouteDownloadReportMenuItem = forwardRef(
  RouteDownloadReportMenuItemImpl,
);
