import { Units } from '@turf/turf';

export const steps = 64; // Point count for Turf circle polygon approximation.
export const units: Units = 'meters';
export const areaCirclePadding = 4; // Meters; Magic number that produces neat results
export const minFunctionalArea = 10; // Meters
export const pixelSize = 1000; // Pixels in assumed square viewport
