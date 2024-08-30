import noop from 'lodash/noop';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../../../uiComponents';
import { StopRowTdProps } from '../../../../search/StopTableRow';

const testIds = {
  removeStopMenuItem: 'StopTableRow::ActionMenu::removeStopMenuItem',
};

const RemoveMemberStopImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  StopRowTdProps
> = ({ className }, ref) => {
  const { t } = useTranslation();

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      disabled
      className={className}
      text={t('stopAreaDetails.memberStops.menuActions.remove')}
      onClick={noop}
      testId={testIds.removeStopMenuItem}
    />
  );
};

export const RemoveMemberStop = forwardRef(RemoveMemberStopImpl);
