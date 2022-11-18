import { useHistory } from 'react-router-dom';
import { Path, routeDetails } from '../router/routeDetails';
import { IconButton } from './IconButton';
import { commonHoverStyle } from './SimpleButton';

const testIds = {
  button: 'LocatorButton::button',
};

interface Props {
  testId?: string;
  disabled?: boolean;
  lineId: UUID;
  className?: string;
}

export const LineTimetablesButton = ({
  testId,
  disabled,
  lineId,
  className = '',
}: Props): JSX.Element => {
  const disabledStyle = '!bg-background opacity-70 pointer-events-none';
  const history = useHistory();
  const onClick = () => {
    history.push({
      pathname: routeDetails[Path.lineTimetables].getLink(lineId),
    });
  };
  return (
    <IconButton
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${commonHoverStyle} ${
        disabled ? disabledStyle : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      icon={<i className="icon-calendar" />}
      testId={testId || testIds.button}
    />
  );
};
