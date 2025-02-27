import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleDropdownMenuItem } from '../../../../../uiComponents';

type ShowAreaOnMapProps = {
  readonly className?: string;
  readonly onClick: () => void;
  readonly testId: string;
};

export const ShowAreaOnMap = forwardRef<HTMLButtonElement, ShowAreaOnMapProps>(
  ({ className, onClick, testId }, ref) => {
    const { t } = useTranslation();

    return (
      <SimpleDropdownMenuItem
        className={className}
        text={t('stopRegistrySearch.stopAreaRowActions.showOnMap')}
        onClick={onClick}
        testId={testId}
        ref={ref}
      />
    );
  },
);

ShowAreaOnMap.displayName = 'ShowAreaOnMap';
