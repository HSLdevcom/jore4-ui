import { FC, ReactNode, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { CloseIconButton, ConfirmationDialog } from '../../../uiComponents';
import s from './TaskWithProgressBar.module.css';
import { ConfirmProps, Progress } from './types';

const testIds = {
  defaultId: 'TaskWithProgressBar',
  abort: 'TaskWithProgressBar::abort',
};

type TaskWithProgressBarProps = {
  readonly body: ReactNode;
  readonly onCancel: () => void;
  readonly onConfirmCancellation?: () => ConfirmProps;
  readonly progress: Progress;
  readonly testId?: string;
};

export const TaskWithProgressBar: FC<TaskWithProgressBarProps> = ({
  body,
  onConfirmCancellation,
  onCancel,
  progress: { indeterminate, progress },
  testId = testIds.defaultId,
}) => {
  const { t } = useTranslation();

  const bodyLabelId = useId();

  const [confirmProps, setConfirmProps] = useState<ConfirmProps | null>(null);

  return (
    <div
      className="flex items-center"
      aria-live="assertive"
      data-testid={testId}
    >
      <div className="flex grow flex-col items-center">
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={indeterminate ? undefined : Math.round(progress * 100)}
          aria-labelledby={bodyLabelId}
          className={twMerge(
            'w-full bg-tweaked-brand',
            s.pbContainer,
            s.pbRounded,
            s.pbAnimated,
            indeterminate && s.pbStriped,
          )}
        >
          <div
            className={s.pbFill}
            style={{ width: indeterminate ? '100%' : `${progress * 100}%` }}
          />
        </div>

        <div className="mt-1" id={bodyLabelId}>
          {body}
        </div>
      </div>

      <CloseIconButton
        className="ml-2 font-bold text-brand [&>i]:text-2xl"
        title={t('abort')}
        onClick={() =>
          onConfirmCancellation
            ? setConfirmProps(onConfirmCancellation())
            : onCancel()
        }
        testId={testIds.abort}
      />

      {confirmProps && (
        <ConfirmationDialog
          isOpen
          onConfirm={onCancel}
          onCancel={() => setConfirmProps(null)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...confirmProps}
        />
      )}
    </div>
  );
};
