import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

if (process.browser) {
  // Leaflet has to be imported dynamically and only in browsers - otherwise
  // next.js tries to import it on server and then we get "window is undefined"
  // errors.

  // @ts-expect-error TS compiler isn't happy with top-level await nor .default import, but this seems to work anyway as we have enabled top level awaits in next.js config
  const L = (await import('leaflet')).default;

  // Tell leaflet where to find image assets
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  L.Marker.prototype.options.icon = DefaultIcon;
}
