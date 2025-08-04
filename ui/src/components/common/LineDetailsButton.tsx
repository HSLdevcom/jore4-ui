import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { Path, routeDetails } from '../../router/routeDetails';
import { IconButton } from '../../uiComponents/IconButton';
import { getHoverStyles } from '../../uiComponents/SimpleButton';

const testIds = {
  button: 'LocatorButton::button',
};

type LineDetailsButtonProps = {
  readonly testId?: string;
  readonly lineId: UUID;
  readonly label: string;
  readonly routeLabel?: string;
  readonly className?: string;
};

export const LineDetailsButton: FC<LineDetailsButtonProps> = ({
  testId,
  lineId,
  label,
  routeLabel,
  className = '',
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClick = () => {
    navigate(
      routeDetails[Path.lineDetails].getLink(lineId, {
        routeLabels: routeLabel,
      }),
    );
  };
  return (
    <IconButton
      tooltip={t('accessibility:lines.details', { label })}
      className={twMerge(
        'h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand',
        getHoverStyles(false, false),
        className,
      )}
      onClick={onClick}
      icon={<i className="icon-bus-alt" aria-hidden />}
      testId={testId ?? testIds.button}
    />
  );
};
