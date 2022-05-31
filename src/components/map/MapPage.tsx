import { Map } from './Map';

export const MapPage = () => {
  /*
    Setting height of map component dynamically seems to be tricky as
    it doesn't respect e.g. "height: 100%" rule.
    As a workaround we can use css's `calc` function and magically subtract
    height of NavBar and footer full screen height.
    This is ugly, but seems to work perfectly - at least until someone changes
    height of header/footer...
  */
  return (
    <Map height="calc(100vh - var(--navbar-height) - var(--footer-height))" />
  );
};
