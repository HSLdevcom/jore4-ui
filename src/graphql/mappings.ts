export const mapInsertPointInput = (latitude: number, longitude: number) => {
  return {
    variables: {
      geojson: {
        type: 'Point',
        coordinates: [latitude, longitude],
      },
    },
  };
};
