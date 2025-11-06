import { DateTime } from 'luxon';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { mapToShortDate, mapToShortTime } from '../../../../time';
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
import { useGenerateEquipmentReport } from '../csv-export/useGenerateEquipmentReport';
import { ResultSelection, StopSearchFilters } from '../types';

const testIds = {
  button: 'DownloadEquipmentReportMenu::button',
  filename: 'DownloadEquipmentReportMenu::filename',
};

type DownloadEquipmentReportMenuItemProps = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly filters: StopSearchFilters;
  readonly selection: ResultSelection;
};

const DownloadEquipmentReportMenuItemImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  DownloadEquipmentReportMenuItemProps
> = ({ className, disabled = false, filters, selection }, ref) => {
  const { t } = useTranslation();

  const registerAsyncTask = useRegisterAsyncTask();
  const generateEquipmentReport = useGenerateEquipmentReport();

  const onGenerationFinished = (fileName: string) => {
    showSuccessToast(
      <Trans
        t={t}
        i18nKey="stopRegistrySearch.csv.downloaded"
        components={{
          Filename: <span data-testid={testIds.filename}>{fileName}</span>,
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
    const now = DateTime.now();

    registerAsyncTask((onProgress, unregisterTask, id) => {
      const abortController = new AbortController();

      const initialize = () => {
        generateEquipmentReport(
          filters,
          selection,
          t('stopRegistrySearch.csv.equipmentReportFileName', {
            today: mapToShortDate(now),
            now: mapToShortTime(now),
          }),
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
      text={t('stopRegistrySearch.csv.downloadEquipmentReport')}
      onClick={onClick}
      testId={testIds.button}
    />
  );
};

export const DownloadEquipmentReportMenuItem = forwardRef(
  DownloadEquipmentReportMenuItemImpl,
);
