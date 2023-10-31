import { useNavigate } from 'react-router-dom';
import { Path, routeDetails } from '../../router/routeDetails';
import { IconButton } from '../../uiComponents/IconButton';
import { commonHoverStyle } from '../../uiComponents/SimpleButton';

const testIds = {
  button: 'LocatorButton::button',
};

interface Props {
  testId?: string;
  lineId: UUID;
  routeLabel?: string;
  className?: string;
}

export const LineDetailsButton = ({
  testId,
  lineId,
  routeLabel,
  className = '',
}: Props): JSX.Element => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(routeDetails[Path.lineDetails].getLink(lineId, routeLabel));
  };
  return (
    <IconButton
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${commonHoverStyle} ${className}`}
      onClick={onClick}
      icon={<i className="icon-bus-alt" />}
      testId={testId || testIds.button}
    />
  );
};
