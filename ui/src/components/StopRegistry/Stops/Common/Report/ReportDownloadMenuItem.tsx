import { ForwardRefRenderFunction, forwardRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  AsyncTaskCancelledError,
  showDangerToastWithError,
  showSuccessToast,
  showWarningToast,
} from '../../../../../utils';
import {
  ConfirmCancellation,
  useRegisterAsyncTask,
} from '../../../../common/AsyncTaskList';
import { SimpleDropdownMenuItem } from '../../../../common/Dropdowns';
import { RunReportGeneration } from './types';

const testIds = {
  button: (type: string) => `${type}::button`,
  filename: (type: string) => `${type}::filename`,
};

type ReportDownloadMenuItemProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly genFilename: () => string;
  readonly generate: RunReportGeneration;
  readonly text: string;
  readonly type: string;
};

const ReportDownloadMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  ReportDownloadMenuItemProps
> = (
  { className, disabled = false, genFilename, generate, text, type },
  ref,
) => {
  const { t } = useTranslation();

  const registerAsyncTask = useRegisterAsyncTask();

  const onGenerationFinished = (fileName: string) => {
    showSuccessToast(
      <Trans
        t={t}
        i18nKey={($) => $.stopRegistrySearch.csv.downloaded}
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
      showWarningToast(t(($) => $.stopRegistrySearch.csv.generationCanceled));
    } else {
      showDangerToastWithError(
        t(($) => $.stopRegistrySearch.csv.generationError),
        e,
      );
    }
  };

  const onClick = () => {
    const filename = genFilename();

    registerAsyncTask((onProgress, unregisterTask, id) => {
      const abortController = new AbortController();

      const initialize = () => {
        generate(
          filename,
          t(($) => $.stopRegistrySearch.csv.saveAs),
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
        title: t(($) => $.stopRegistrySearch.csv.confirmCancellationTitle),
        description: t(($) => $.stopRegistrySearch.csv.confirmCancellationBody),
        confirmText: t(($) => $.abort),
        cancelText: t(($) => $.dontAbort),
        widthClassName: 'w-235',
      });

      return {
        body: t(($) => $.stopRegistrySearch.csv.generationInProgress),
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

export const ReportDownloadMenuItem = forwardRef(ReportDownloadMenuItemImpl);
