import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { QueryParameterName } from '../../hooks';
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
  const history = useHistory();

  const onClick = () => {
    // NOTE: We cannot use routeDetails[Path.lineDetails].getLink(lineId, routeLabel) with this
    // bevause the the pathname and the search (queryParams) has to be separated in history.push()
    history.push({
      pathname: routeDetails[Path.lineDetails].getLink(lineId),
      search: routeLabel
        ? `?${qs.stringify({
            [QueryParameterName.RouteLabels]: routeLabel,
          })}`
        : '',
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
