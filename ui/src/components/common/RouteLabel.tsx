import { Visible } from '../../layoutComponents';
import { hasRouteVariant, RouteWithLabel } from '../../utils/route';

interface Props {
  route: RouteWithLabel;
}

export const RouteLabel = ({ route }: Props) => {
  return (
    <>
      <b>{route.label}</b>
      <Visible visible={hasRouteVariant(route)}>
        <span className="font-normal"> {route?.variant}</span>
      </Visible>
    </>
  );
};
