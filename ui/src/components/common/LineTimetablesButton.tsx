import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../router/routeDetails';
import { IconButton } from '../../uiComponents';

const testIds = {
  button: 'LocatorButton::button',
};

type LineTimetablesButtonProps = {
  readonly testId?: string;
  readonly disabled?: boolean;
  readonly lineId: UUID;
  readonly routeLabel?: string;
  readonly label: string;
  readonly className?: string;
};

export const LineTimetablesButton: FC<LineTimetablesButtonProps> = ({
  testId,
  disabled,
  lineId,
  routeLabel,
  label,
  className,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate(
      routeDetails[Path.lineTimetables].getLink(lineId, {
        routeLabels: routeLabel,
      }),
    );
  };
  return (
    <IconButton
      tooltip={t('accessibility:lines.showTimetables', { label })}
      className={twMerge(
        'h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand',
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        'hover:enabled:border-tweaked-brand enabled:hover:outline-tweaked-brand',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      icon={<i className="icon-calendar" aria-hidden />}
      testId={testId ?? testIds.button}
    />
  );
};
