import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';
import { LocatableStopWithObservationDateProps } from '../../types';
import { useShowStopOnMap } from '../../utils/useShowStopOnMap';

const testIds = {
  showOnMap: 'StopTableRow::ActionMenu::ShowOnMap',
};

const ShowOnMapImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  LocatableStopWithObservationDateProps
> = ({ className, observationDate, stop }, ref) => {
  const { t } = useTranslation();
  const openStopOnMap = useShowStopOnMap();

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      text={t('stopRegistrySearch.stopRowActions.showOnMap')}
      onClick={() => openStopOnMap(stop, observationDate)}
      testId={testIds.showOnMap}
    />
  );
};

export const ShowOnMap = forwardRef(ShowOnMapImpl);
