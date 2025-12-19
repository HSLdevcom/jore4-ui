import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { SimpleButton } from '../../../../../uiComponents';

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
    <SimpleButton
      shape="round"
      inverted
      className={twJoin('h-11 w-11', className)}
      testId={testIds.button}
      tooltip={t('accessibility:stops.stopTimetablesButton')}
      disabled={disabledUntilImplemented}
      type="button"
      onClick={noop}
    >
      <i aria-hidden className="icon-calendar text-2xl text-brand" />
    </SimpleButton>
  );
};
