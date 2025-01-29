import noop from 'lodash/noop';
import { ForwardRefRenderFunction, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../../../uiComponents';
import { StopRowTdProps } from '../../../../search/StopTableRow';

const testIds = {
  removeStopMenuItem: 'StopTableRow::ActionMenu::removeStopMenuItem',
};

type RemoveMemberStopProps = StopRowTdProps & {
  readonly onRemove: (stopId: string) => void;
};

const RemoveMemberStopImpl: ForwardRefRenderFunction<
  HTMLButtonElement,
  RemoveMemberStopProps
> = ({ className, onRemove, stop }, ref) => {
  const { t } = useTranslation();

  const id = stop.quay.netexId;

  return (
    <SimpleDropdownMenuItem
      ref={ref}
      className={className}
      disabled={!id}
      text={t('stopAreaDetails.memberStops.menuActions.remove')}
      onClick={id ? () => onRemove(id) : noop}
      testId={testIds.removeStopMenuItem}
    />
  );
};

export const RemoveMemberStop = forwardRef(RemoveMemberStopImpl);
