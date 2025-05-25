import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Path, routeDetails } from '../../router/routeDetails';
import { IconButton } from '../../uiComponents/IconButton';
import { commonHoverStyle } from '../../uiComponents/SimpleButton';

const testIds = {
  button: 'LocatorButton::button',
};

type LineDetailsButtonProps = {
  testId?: string;
  lineId: UUID;
  label: string;
  routeLabel?: string;
  className?: string;
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
    navigate(routeDetails[Path.lineDetails].getLink(lineId, routeLabel));
  };
  return (
    <IconButton
      tooltip={t('accessibility:lines.details', { label })}
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${commonHoverStyle} ${className}`}
      onClick={onClick}
      icon={<i className="icon-bus-alt" aria-hidden />}
      testId={testId ?? testIds.button}
    />
  );
};
