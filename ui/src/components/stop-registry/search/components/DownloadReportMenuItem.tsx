import { ForwardRefRenderFunction, forwardRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import {
  AsyncTaskCancelledError,
  showDangerToastWithError,
  showSuccessToast,
  showWarningToast,
} from '../../../../utils';
import {
  ConfirmCancellation,
  useRegisterAsyncTask,
} from '../../../common/AsyncTaskList';
import { GenerateReport } from '../csv-export/types';
import { ResultSelection, StopSearchFilters } from '../types';

const testIds = {
  button: (type: string) => `${type}::button`,
  filename: (type: string) => `${type}::filename`,
};

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
    disabled = false,
    filters,
    generateReport,
    genFilename,
    selection,
    text,
    type,
  },
  ref,
) => {
  const { t } = useTranslation();

  const registerAsyncTask = useRegisterAsyncTask();

  const onGenerationFinished = (fileName: string) => {
    showSuccessToast(
      <Trans
        t={t}
        i18nKey="stopRegistrySearch.csv.downloaded"
        components={{
          Filename: (
            <span data-testid={testIds.filename(type)}>{fileName}</span>
          ),
        }}
      />,
    );
  };

  const onGenerationError = (e: unknown) => {
    const cancellationError = AsyncTaskCancelledError.findFromErrorChain(e);
    if (cancellationError) {
      showWarningToast(t('stopRegistrySearch.csv.generationCanceled'));
    } else {
      showDangerToastWithError(t('stopRegistrySearch.csv.generationError'), e);
    }
  };

  const onClick = () => {
    const filename = genFilename();

    registerAsyncTask((onProgress, unregisterTask, id) => {
      const abortController = new AbortController();

      const initialize = () => {
        generateReport(
          filters,
          selection,
          filename,
          t('stopRegistrySearch.csv.saveAs'),
          abortController.signal,
          onProgress,
        )
          .then(onGenerationFinished)
          .catch(onGenerationError)
          .finally(unregisterTask);
      };

      const onCancel = () => {
        abortController.abort(
          new AsyncTaskCancelledError(`User aborted CSV generation. ${id}`),
        );
      };

      const onConfirmCancellation: ConfirmCancellation = () => ({
        title: t('stopRegistrySearch.csv.confirmCancellationTitle'),
        description: t('stopRegistrySearch.csv.confirmCancellationBody'),
        confirmText: t('abort'),
        cancelText: t('dontAbort'),
        widthClassName: 'w-235',
      });

      return {
        body: t('stopRegistrySearch.csv.generationInProgress'),
        initialize,
        onCancel,
        onConfirmCancellation,
      };
    });
  };

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      disabled={disabled}
      text={text}
      onClick={onClick}
      testId={testIds.button(type)}
    />
  );
};

export const DownloadReportMenuItem = forwardRef(DownloadReportMenuItemImpl);
