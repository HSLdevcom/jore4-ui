import { FC, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { theme } from '../../../../generated/theme';
import { SimpleButton } from '../../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../../utils';
import { useGenerateEquipmentReport } from '../csv-export/useGenerateEquipmentReport';
import { StopSearchFilters, defaultResultSelection } from '../types';

const testIds = {
  button: 'DownloadResultsAsCSVButton::button',
  loading: 'DownloadResultsAsCSVButton::loading',
  filename: 'DownloadResultsAsCSVButton::filename',
};

type DownloadResultsAsCSVButtonProps = {
  readonly className?: string;
  readonly filters: StopSearchFilters;
};

export const DownloadResultsAsCSVButton: FC<
  DownloadResultsAsCSVButtonProps
> = ({ className, filters }) => {
  const { t } = useTranslation();

  const [generating, setGenerating] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const generateEquipmentReport = useGenerateEquipmentReport();

  const onClick = () => {
    setGenerating(true);
    setIndeterminate(true);

    const fileName = 'Välineraportti.csv';
    generateEquipmentReport(
      filters,
      defaultResultSelection,
      fileName,
      (progressUpdate) => {
        if (progressUpdate.indeterminate) {
          setIndeterminate(true);
          setProgress(0);
        } else {
          setIndeterminate(false);
          setProgress(progressUpdate.progress);
        }
      },
    )
      .then(() =>
        showSuccessToast(
          <Trans
            t={t}
            i18nKey="stopRegistrySearch.csvDownloaded"
            components={{
              Filename: <span data-testid={testIds.filename}>{fileName}</span>,
            }}
          />,
        ),
      )
      .catch((e) => {
        console.error(e);
        showDangerToastWithError(t('stopRegistrySearch.csvGenerationError'), e);
      })
      .finally(() => setGenerating(false));
  };

  return (
    <SimpleButton
      className={twMerge(
        'px-3 py-1 text-sm leading-none disabled:cursor-wait',
        'flex flex-col gap-1',
        className,
      )}
      disabled={generating}
      onClick={onClick}
      testId={testIds.button}
      type="button"
    >
      {generating ? (
        <>
          <PulseLoader
            color={theme.colors.brand}
            cssOverride={{ margin: '-2px' }}
            data-testid={testIds.loading}
            size={14}
          />
          <progress
            className="h-[2px]"
            max={1}
            value={indeterminate ? undefined : progress}
          />
        </>
      ) : (
        t('stopRegistrySearch.downloadAsCsv')
      )}
    </SimpleButton>
  );
};
