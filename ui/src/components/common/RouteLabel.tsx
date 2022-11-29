import { gql } from '@apollo/client';
import { RouteLabelFragment } from '../../generated/graphql';
import { Visible } from '../../layoutComponents';

const GQL_ROUTE_LABEL_FIELDS = gql`
  fragment route_label on route_route {
    label
    variant
  }
`;

interface Props {
  route: RouteLabelFragment;
}

const hasRouteVariant = (route: RouteLabelFragment) =>
  Number.isInteger(route?.variant);

export const getRouteLabelText = (route: RouteLabelFragment) =>
  `${route.label}${hasRouteVariant(route) ? ` ${route.variant}` : ''}`;

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
