export const mapToObject = (object: ExplicitAny) => {
  return { object };
};

export const mapToVariables = (variables: ExplicitAny) => {
  return { variables };
};

export const mapCoordinatesToPoint = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  // TODO: where should we get z-coordinate? Api schema requires it.
  // Use 0 as z-coordinate for now.
  return { type: 'Point', coordinates: [lng, lat, 0] };
};
