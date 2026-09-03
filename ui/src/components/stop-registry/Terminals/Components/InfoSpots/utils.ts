import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { useState } from 'react';
import {
  InfoSpotDetailsFragment,
  StopRegistryIntendedUser,
} from '../../../../../generated/graphql';
import {
  EnrichedParentStopPlace,
  Point,
  StopPlaceInfoSpots,
} from '../../../../../types';
import { getGeometryPoint } from '../../../../../utils';
import { InfoSpotPurposeEnum } from '../../../stops/stop-details/info-spots/types/InfoSpotPurpose';
import {
  formatSizedDbItem,
  mapInfoSpotDataToFormState,
} from '../../../stops/stop-details/info-spots/utils';
import { mapPurposeToString } from '../../../stops/stop-details/info-spots/utils/infoSpotPurposeUtils';
import { SortConfig, SortField, TerminalInfoSpotFormState } from './Types';

export const CSS_CLASSES = {
  evenRow: 'bg-background',
  oddRow: '',
  openRow: 'bg-background-hsl-commuter-train-purple/25',
  tableCell: 'w-0 text-nowrap px-3 xl:px-5 py-3 text-sm',
  descriptionCell: 'w-full px-3 xl:px-5 py-3 text-sm',
  actionCell: 'w-0 py-3 pr-3 text-sm',
};

export function resolveQuayPublicCode(
  infoSpot: InfoSpotDetailsFragment,
  terminal: EnrichedParentStopPlace,
): string | null {
  if (!infoSpot || !infoSpot.infoSpotLocations?.length) {
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

export function resolveInfoSpotQuay(
  infoSpot: InfoSpotDetailsFragment,
  terminal: EnrichedParentStopPlace,
) {
  if (!infoSpot || !infoSpot.infoSpotLocations?.length) {
    return null;
  }

  const allQuays = compact(terminal.children).flatMap((child) =>
    compact(child.quays),
  );

  const containingQuay = infoSpot.infoSpotLocations
    .map((location) => allQuays.find((quay) => quay.id === location))
    .find(Boolean);

  return containingQuay ?? null;
}

export function resolveQuayStopPlaceName(
  terminal: EnrichedParentStopPlace,
  quayId?: string | null,
) {
  if (!quayId) {
    return undefined;
  }

  return terminal.children?.find((child) => {
    const quayFound = child?.quays?.some((quay) => quay?.id === quayId);

    if (quayFound) {
      return child?.name;
    }

    return undefined;
  });
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
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getSortIcon = (field: SortField): string => {
    return sortConfig.field === field ? 'icon-arrow' : 'icon-arrow-2';
  };

  const getSortIconTransform = (field: SortField): string => {
    return sortConfig.field === field && sortConfig.direction === 'asc'
      ? 'rotate-180'
      : '';
  };

  return {
    sortConfig,
    handleSort,
    getSortIcon,
    getSortIconTransform,
  };
}

function getSortValue(
  infoSpot: StopPlaceInfoSpots,
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
    case 'intendedUser':
      return getDisplayValue(infoSpot.intendedUser);
    case 'size':
      return getDisplayValue(formatSizedDbItem(t, infoSpot));
    case 'description':
      return getDisplayValue(infoSpot.description?.value);
    default:
      return '';
  }
}

function compareSizeValues(
  a: StopPlaceInfoSpots,
  b: StopPlaceInfoSpots,
): number {
  const widthDiff = (a.width ?? 0) - (b.width ?? 0);
  return widthDiff !== 0 ? widthDiff : (a.height ?? 0) - (b.height ?? 0);
}

export function sortInfoSpots(
  infoSpots: ReadonlyArray<StopPlaceInfoSpots>,
  sortConfig: SortConfig,
  t: TFunction,
  terminal: EnrichedParentStopPlace,
): ReadonlyArray<StopPlaceInfoSpots> {
  if (!sortConfig.field) {
    return infoSpots;
  }

  const { field, direction } = sortConfig;

  return [...infoSpots].sort((a, b) => {
    const comparison =
      field === 'size'
        ? compareSizeValues(a, b)
        : getSortValue(a, field, t, terminal).localeCompare(
            getSortValue(b, field, t, terminal),
          );

    if (comparison !== 0) {
      return direction === 'asc' ? comparison : -comparison;
    }

    return (a.id ?? '').localeCompare(b.id ?? '');
  });
}

export function getTerminalInfoSpotLocation(
  infoSpot: Readonly<InfoSpotDetailsFragment>,
  terminal: Readonly<EnrichedParentStopPlace>,
): Point | null {
  // If infospot has a location use that
  // If not and quay infospot, use quay location
  // Otherwise use terminal location
  if (infoSpot.geometry) {
    return getGeometryPoint(infoSpot.geometry);
  }

  const infoSpotQuay = resolveInfoSpotQuay(infoSpot, terminal);
  if (infoSpotQuay?.geometry) {
    return getGeometryPoint(infoSpotQuay.geometry);
  }

  if (terminal.geometry) {
    return getGeometryPoint(terminal.geometry);
  }

  return null;
}

export function mapTerminalInfoSpotDataToFormState(
  infoSpot: StopPlaceInfoSpots,
  terminal: EnrichedParentStopPlace,
): TerminalInfoSpotFormState {
  const location = getTerminalInfoSpotLocation(infoSpot, terminal);

  return {
    ...mapInfoSpotDataToFormState(infoSpot),
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
  };
}

export function getDefaultIntendedUser(
  terminal: EnrichedParentStopPlace,
): StopRegistryIntendedUser {
  const ownerName = terminal.owner?.name?.trim().toUpperCase();
  if (!ownerName) {
    return StopRegistryIntendedUser.Matkatieto;
  }

  const matchedIntendedUser = Object.values(StopRegistryIntendedUser).find(
    (intendedUser) => intendedUser === ownerName,
  );

  return matchedIntendedUser ?? StopRegistryIntendedUser.Muu;
}

// Default terminal label format: [terminalCode]_[orderNumber], where orderNumber is infoSpotCount + 1.
// If terminalCode is not available, use just the orderNumber.
export function getTerminalInfoSpotLabel(
  terminal: EnrichedParentStopPlace,
): string {
  const terminalCode = terminal.privateCode?.value ?? '';
  const orderNumber = (terminal.infoSpots?.length ?? 0) + 1;
  return terminalCode ? `${terminalCode}_${orderNumber}` : `${orderNumber}`;
}

export const defaultTerminalInfoSpotPosterValues = {
  label: mapPurposeToString({
    purposeType: InfoSpotPurposeEnum.POSTER,
    customPurpose: null,
  }),
  width: 800,
  height: 1200,
};

export const defaultTerminalInfoSpotValues = {
  width: 800,
  height: 1200,
  poster: [defaultTerminalInfoSpotPosterValues],
};
