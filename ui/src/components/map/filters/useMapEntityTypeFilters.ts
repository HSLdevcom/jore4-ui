import { useTranslation } from 'react-i18next';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  MapEntityType,
  selectShowMapEntityTypes,
  setShowMapEntityTypeAction,
} from '../../../redux';
import { FilterItem } from './types';

type InitialFilterItem = {
  readonly type: MapEntityType;
  readonly label: string;
  readonly disabled: boolean;
};

type MapEntityTypeFilters = {
  readonly infoTypes: ReadonlyArray<FilterItem>;
  readonly stopTypes: ReadonlyArray<FilterItem>;
};

function useInitialFilterInfo() {
  const { t } = useTranslation();

  const initialInfoTypes: ReadonlyArray<InitialFilterItem> = [
    {
      type: MapEntityType.InfoSpot,
      label: t('filters.mapEntityType.infoSpot'),
      disabled: true,
    },
  ];

  const initialStopTypes: ReadonlyArray<InitialFilterItem> = [
    {
      type: MapEntityType.Stop,
      label: t('filters.mapEntityType.stop'),
      disabled: false,
    },
    {
      type: MapEntityType.StopArea,
      label: t('filters.mapEntityType.stopArea'),
      disabled: false,
    },
    {
      type: MapEntityType.Terminal,
      label: t('filters.mapEntityType.terminal'),
      disabled: true,
    },
  ];

  return { initialInfoTypes, initialStopTypes };
}

export function useMapEntityTypeFilters(): MapEntityTypeFilters {
  const showMapEntityType = useAppSelector(selectShowMapEntityTypes);
  const setShowMapEntityType = useAppAction(setShowMapEntityTypeAction);

  const { initialInfoTypes, initialStopTypes } = useInitialFilterInfo();

  const mapToProperFilter: (item: InitialFilterItem) => FilterItem = ({
    type,
    label,
    disabled,
  }) => ({
    id: `filter-${type}`,
    isActive: showMapEntityType[type],
    toggleFunction: (shown) =>
      setShowMapEntityType({ entityType: type, shown }),
    label,
    disabled,
  });

  return {
    infoTypes: initialInfoTypes.map(mapToProperFilter),
    stopTypes: initialStopTypes.map(mapToProperFilter),
  };
}
