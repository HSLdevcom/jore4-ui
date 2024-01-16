import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Path, routeDetails } from '../../router/routeDetails';
import { IconButton, commonHoverStyle } from '../../uiComponents';

const testIds = {
  button: 'LocatorButton::button',
};

interface Props {
  testId?: string;
  disabled?: boolean;
  lineId: UUID;
  routeLabel?: string;
  label: string;
  className?: string;
}

export const LineTimetablesButton = ({
  testId,
  disabled,
  lineId,
  routeLabel,
  label,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const disabledStyle = '!bg-background opacity-70 pointer-events-none';
  const navigate = useNavigate();

  const onClick = () => {
    navigate(routeDetails[Path.lineTimetables].getLink(lineId, routeLabel));
  };
  return (
    <IconButton
      title={t('accessibility:lines.showTimetables', { label })}
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${commonHoverStyle} ${
        disabled ? disabledStyle : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      icon={<i className="icon-calendar" aria-hidden />}
      testId={testId || testIds.button}
    />
  );
};
