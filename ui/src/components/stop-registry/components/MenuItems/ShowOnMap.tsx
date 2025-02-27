import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { LocatableStopProps } from '../../types';
import { useShowStopOnMap } from '../../utils/useShowStopOnMap';

const testIds = {
  showOnMap: 'StopTableRow::ActionMenu::ShowOnMap',
};

const ShowOnMapImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  LocatableStopProps
> = ({ className, stop }, ref) => {
  const { t } = useTranslation();
  const openStopOnMap = useShowStopOnMap();

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t('stopRegistrySearch.stopRowActions.showOnMap')}
      onClick={() => openStopOnMap(stop)}
      testId={testIds.showOnMap}
    />
  );
};

export const ShowOnMap = forwardRef(ShowOnMapImpl);
