import { Scalars } from '../generated/graphql';
import { Point } from '../types';

export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};

export const mapPointToPointGeography = ({
  latitude,
  longitude,
}: Point): Scalars['geography'] => {
  // TODO: where should we get z-coordinate? Api schema requires it.
  // Use 0 as z-coordinate for now.
  return { type: 'Point', coordinates: [longitude, latitude, 0] };
};
