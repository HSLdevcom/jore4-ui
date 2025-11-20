import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch } from '../../../hooks';
import { setShowMapEntityTypeFilterOverlayAction } from '../../../redux';
import { CloseIconButton } from '../../../uiComponents';
import { MapOverlay, MapOverlayHeader } from '../MapOverlay';
import { MapEntityTypeFilters } from './MapEntityTypeFilters';
import { TimeAndPriorityFilters } from './TimeAndPriorityFilters';
import { ClassNameProps } from './types';

const testIds = {
  closeButton: 'FilterPanel::closeButton',
};

export const ItemTypeFiltersOverlay: FC<ClassNameProps> = ({ className }) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const onCloseClick = () => {
    dispatch(setShowMapEntityTypeFilterOverlayAction(false));
  };

  return (
    <MapOverlay className={twMerge(`w-[430px] rounded-b`, className)}>
      <MapOverlayHeader>
        <h4>{t('filters.title')}</h4>
        <CloseIconButton onClick={onCloseClick} testId={testIds.closeButton} />
      </MapOverlayHeader>
      <div className="flex gap-4">
        <MapEntityTypeFilters className="p-4" />
        <TimeAndPriorityFilters className="bg-background p-4" />
      </div>
    </MapOverlay>
  );
};
