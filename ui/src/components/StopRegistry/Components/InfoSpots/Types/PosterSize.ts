export type PosterSize = {
  readonly width: number; // Millimeters
  readonly height: number; // Millimeters
};

export type LabelledPosterSize = {
  readonly label: string;
  readonly size: PosterSize;
};

const aSeries: ReadonlyArray<LabelledPosterSize> = [
  { label: 'A0', size: { width: 841, height: 1189 } },
  { label: 'A1', size: { width: 594, height: 841 } },
  { label: 'A2', size: { width: 420, height: 594 } },
  { label: 'A3', size: { width: 297, height: 420 } },
  { label: 'A4', size: { width: 210, height: 297 } },
  { label: 'A5', size: { width: 148, height: 210 } },
  { label: 'A6', size: { width: 105, height: 148 } },
  { label: 'A7', size: { width: 74, height: 105 } },
  { label: 'A8', size: { width: 52, height: 74 } },
  { label: 'A9', size: { width: 37, height: 52 } },
  { label: 'A10', size: { width: 26, height: 37 } },
];

const bSeries: ReadonlyArray<LabelledPosterSize> = [
  { label: 'B0', size: { width: 1000, height: 1414 } },
  { label: 'B1', size: { width: 707, height: 1000 } },
  { label: 'B2', size: { width: 500, height: 707 } },
  { label: 'B3', size: { width: 353, height: 500 } },
  { label: 'B4', size: { width: 250, height: 353 } },
  { label: 'B5', size: { width: 176, height: 250 } },
  { label: 'B6', size: { width: 125, height: 176 } },
  { label: 'B7', size: { width: 88, height: 125 } },
  { label: 'B8', size: { width: 62, height: 88 } },
  { label: 'B9', size: { width: 44, height: 62 } },
  { label: 'B10', size: { width: 31, height: 44 } },
];

const cSeries: ReadonlyArray<LabelledPosterSize> = [
  { label: 'C0', size: { width: 917, height: 1297 } },
  { label: 'C1', size: { width: 648, height: 917 } },
  { label: 'C2', size: { width: 458, height: 648 } },
  { label: 'C3', size: { width: 324, height: 458 } },
  { label: 'C4', size: { width: 229, height: 324 } },
  { label: 'C5', size: { width: 162, height: 229 } },
  { label: 'C6', size: { width: 114, height: 162 } },
  { label: 'C7', size: { width: 81, height: 114 } },
  { label: 'C8', size: { width: 57, height: 81 } },
  { label: 'C9', size: { width: 40, height: 57 } },
  { label: 'C10', size: { width: 28, height: 40 } },
  { label: 'DL', size: { width: 110, height: 220 } },
  { label: 'C7/6', size: { width: 81, height: 162 } },
];

const customJoreSizes: ReadonlyArray<LabelledPosterSize> = [
  { label: '', size: { width: 800, height: 1200 } },
];

export const allKnownPosterSizes: ReadonlyArray<LabelledPosterSize> = [
  ...aSeries,
  ...bSeries,
  ...cSeries,
  ...customJoreSizes,
];

export const standardPosterSizes: ReadonlyArray<LabelledPosterSize> = [
  customJoreSizes[0],
  aSeries[3],
  aSeries[4],
];
