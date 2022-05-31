import { Map } from './Map';

export const MapPage = () => {
  // 120px is the height of NavBar + height of footer (desktop)
  return <Map height="calc(100vh - 120px)" />;
};
