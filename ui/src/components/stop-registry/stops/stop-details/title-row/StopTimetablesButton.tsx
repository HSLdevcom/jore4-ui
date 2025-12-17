import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { getHoverStyles } from '../../../../../uiComponents';

const testIds = {
  button: 'StopTitleRow::stopTimetablesButton',
};

type StopTimetablesButtonProps = {
  readonly className?: string;
};

export const StopTimetablesButton: FC<StopTimetablesButtonProps> = ({
  className,
}) => {
  const { t } = useTranslation();
  const disabledUntilImplemented = true;

  return (
    <button
      className={twMerge(
        'h-11 w-11',
        'flex items-center justify-center',
        'rounded-full border border-grey',
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        getHoverStyles(false, disabledUntilImplemented),
        className,
      )}
      data-testid={testIds.button}
      aria-label={t('accessibility:stops.stopTimetablesButton')}
      title={t('accessibility:stops.stopTimetablesButton')}
      disabled={disabledUntilImplemented}
      type="button"
    >
      <i aria-hidden className="icon-calendar text-2xl text-brand" />
    </button>
  );
};
