import { TFunction } from 'i18next';
import {
  ItemSizeState,
  PosterSize,
  SizedDbItem,
  allKnownPosterSizes,
} from '../types';

function formatSize(size: PosterSize): string {
  const widthCms = size.width / 10;
  const heightCms = size.height / 10;

  // If no decimals on either, don't show decimals at all.
  if (Number.isInteger(widthCms) && Number.isInteger(heightCms)) {
    return `${widthCms} × ${heightCms} cm`;
  }

  // Else format, both to show decimal millimeters or '.0' if other is full integer.
  return `${widthCms.toFixed(1)} × ${heightCms.toFixed(1)} cm`;
}

function assertValidSize(
  option: ItemSizeState | PosterSize,
): asserts option is PosterSize {
  if (typeof option.width !== 'number' || typeof option.height !== 'number') {
    throw new TypeError(
      'Option of type EXISTING must have both width and height.',
    );
  }
}

export function formatSizeOption(option: PosterSize): string {
  const knownSize = allKnownPosterSizes.find(
    ({ size }) => size.width === option.width && size.height === option.height,
  );
  if (knownSize?.label) {
    return `${knownSize.label} (${formatSize(knownSize.size)})`;
  }

  return formatSize(option);
}

export function formatOption(t: TFunction, option: ItemSizeState): string {
  if (option.uiState === 'UNKNOWN') {
    return t('stopDetails.infoSpots.sizes.unknown');
  }

  if (option.uiState === 'NEW') {
    return t('stopDetails.infoSpots.sizes.new');
  }

  assertValidSize(option);
  return formatSizeOption(option);
}

export function formatSizedDbItem(
  t: TFunction,
  { width, height }: SizedDbItem,
): string | null {
  if (typeof width === 'number' && typeof height === 'number') {
    return formatOption(t, { uiState: 'EXISTING', width, height });
  }

  return null;
}
