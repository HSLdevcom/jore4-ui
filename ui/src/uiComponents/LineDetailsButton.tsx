import { useHistory } from 'react-router-dom';
import { Path, routeDetails } from '../router/routeDetails';
import { IconButton } from './IconButton';
import { commonHoverStyle } from './SimpleButton';

const testIds = {
  button: 'LocatorButton::button',
};

interface Props {
  testId?: string;
  lineId: UUID;
  className?: string;
}

export const LineDetailsButton = ({
  testId,
  lineId,
  className = '',
}: Props): JSX.Element => {
  const history = useHistory();
  const onClick = () => {
    history.push({
      pathname: routeDetails[Path.lineDetails].getLink(lineId),
    });
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
