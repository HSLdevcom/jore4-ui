import { Viewport } from '../../../redux/types';

export function isViewportLoaded(viewport: Viewport): boolean {
  const [[west = 0, south = 0], [east = 0, north = 0]] = viewport.bounds;

  return Math.abs(west - east) > 0 && Math.abs(south - north) > 0;
}
