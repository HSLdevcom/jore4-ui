import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { useState } from 'react';
import { InfoSpotDetailsFragment } from '../../../../../generated/graphql';
import { EnrichedParentStopPlace } from '../../../../../types';
import { formatSizedDbItem } from '../../../stops/stop-details/info-spots/utils';
import { SortConfig, SortDirection, SortField } from './types';

export const CSS_CLASSES = {
  evenRow: 'bg-background',
  oddRow: '',
  openRow: 'bg-background-hsl-commuter-train-purple bg-opacity-25',
  tableCell: 'w-[10%] px-5 py-3',
  descriptionCell: 'w-[40%] px-5 py-3',
  actionCell: 'w-0 py-2 pr-3',
};

export function resolveQuayPublicCode(
  infoSpot: InfoSpotDetailsFragment,
  terminal: EnrichedParentStopPlace,
): string | null {
  if (!infoSpot.infoSpotLocations?.length) {
    return null;
  }

  const allQuays = compact(terminal.children).flatMap((child) =>
    compact(child.quays),
  );

  const publicCode = infoSpot.infoSpotLocations
    .map((location) => {
      const matchingQuay = allQuays.find((quay) => quay.id === location);
      return matchingQuay?.publicCode;
    })
    .find(Boolean);

  return publicCode ?? null;
}

export function resolveShelterNumber(
  infoSpot: InfoSpotDetailsFragment,
  terminal: EnrichedParentStopPlace,
): string | null {
  if (!infoSpot.infoSpotLocations?.length) {
    return null;
  }

  const allShelters = compact(terminal.children)
    .flatMap((child) => compact(child.quays))
    .flatMap((quay) => compact(quay.placeEquipments?.shelterEquipment ?? []))
    .filter((shelter) => shelter.id && shelter.shelterNumber);

  const matchingShelter = infoSpot.infoSpotLocations
    .map((location) => allShelters.find((shelter) => shelter.id === location))
    .find(Boolean);

  return matchingShelter?.shelterNumber?.toString() ?? null;
}

export function getDisplayValue(value: string | null | undefined): string {
  return value ?? '';
}

export function formatDisplayValue(value: string | null | undefined): string {
  return value ?? '-';
}

export function useSorting() {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc',
  });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        const newDirection: SortDirection =
          prev.direction === 'asc' ? 'desc' : 'asc';
        return { field, direction: newDirection };
      }
      return { field, direction: 'asc' };
    });
  };

  const getSortIcon = (field: SortField): string => {
    if (sortConfig.field !== field) {
      return 'icon-arrow-2';
    }
    return 'icon-arrow';
  };

  const getSortIconTransform = (field: SortField): string => {
    if (sortConfig.field !== field) {
      return '';
    }
    return sortConfig.direction === 'asc' ? 'rotate-180' : '';
  };

  return {
    sortConfig,
    handleSort,
    getSortIcon,
    getSortIconTransform,
  };
}

function getSortValue(
  infoSpot: InfoSpotDetailsFragment,
  field: SortField,
  t: TFunction,
  terminal: EnrichedParentStopPlace,
): string {
  switch (field) {
    case 'label':
      return getDisplayValue(infoSpot.label);
    case 'stop':
      return getDisplayValue(resolveQuayPublicCode(infoSpot, terminal));
    case 'shelter':
      return getDisplayValue(resolveShelterNumber(infoSpot, terminal));
    case 'purpose':
      return getDisplayValue(infoSpot.purpose);
    case 'size':
      return getDisplayValue(formatSizedDbItem(t, infoSpot));
    case 'description':
      return getDisplayValue(infoSpot.description?.value);
    default:
      return '';
  }
}

export function sortInfoSpots(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment>,
  sortConfig: SortConfig,
  t: TFunction,
  terminal: EnrichedParentStopPlace,
): ReadonlyArray<InfoSpotDetailsFragment> {
  if (!sortConfig.field) {
    return infoSpots;
  }

  const { field } = sortConfig;

  return [...infoSpots].sort((a, b) => {
    const aValue = getSortValue(a, field, t, terminal);
    const bValue = getSortValue(b, field, t, terminal);
    const comparison = aValue.localeCompare(bValue);
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
}
