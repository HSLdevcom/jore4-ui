import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { MapOverlay, MapOverlayHeader } from '../MapOverlay';
import { MapEntityTypeFilters } from './MapEntityTypeFilters';
import { TimeAndPriorityFilters } from './TimeAndPriorityFilters';
import { ClassNameProps } from './types';

export const ItemTypeFiltersOverlay: FC<ClassNameProps> = ({ className }) => {
  const { t } = useTranslation();

  return (
    <MapOverlay className={twMerge(`w-auto rounded-b`, className)}>
      <MapOverlayHeader>
        <h4>{t('filters.title')}</h4>
      </MapOverlayHeader>
      <div className="flex gap-4">
        <MapEntityTypeFilters className="p-4" />
        <TimeAndPriorityFilters className="bg-background p-4" />
      </div>
    </MapOverlay>
  );
};
