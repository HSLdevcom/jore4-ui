import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { LocatableStopWithObserveOnValidityStartProps } from '../../types';
import { useShowStopOnMap } from '../../utils/useShowStopOnMap';

const testIds = {
  showOnMap: 'StopTableRow::ActionMenu::ShowOnMap',
};

const ShowOnMapImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  LocatableStopWithObserveOnValidityStartProps
> = ({ className, observeOnStopValidityStartDate = false, stop }, ref) => {
  const { t } = useTranslation();
  const openStopOnMap = useShowStopOnMap();

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t('stopRegistrySearch.stopRowActions.showOnMap')}
      onClick={() => openStopOnMap(stop, observeOnStopValidityStartDate)}
      testId={testIds.showOnMap}
    />
  );
};

export const ShowOnMap = forwardRef(ShowOnMapImpl);
