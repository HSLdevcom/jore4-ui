// Submits form implemented with `react-hook-form` by ref
// useful in cases where ui designs prevent us from defining
// submit button inside the form
// https://github.com/react-hook-form/react-hook-form/issues/566#issuecomment-730077495
export const submitFormByRef = (formRef: ExplicitAny) => {
  formRef.current?.dispatchEvent(
    new Event('submit', { cancelable: true, bubbles: true }),
  );
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
