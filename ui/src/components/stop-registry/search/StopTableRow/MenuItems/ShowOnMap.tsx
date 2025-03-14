import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../../uiComponents';
import { StopRowTdProps } from '../StopRowTdProps';
import { useOpenStopOnMap } from '../utils';

const testIds = {
  showOnMap: 'StopTableRow::ActionMenu::ShowOnMap',
};

const ShowOnMapImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  StopRowTdProps
> = ({ className, stop }, ref) => {
  const { t } = useTranslation();
  const openStopOnMap = useOpenStopOnMap();

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
