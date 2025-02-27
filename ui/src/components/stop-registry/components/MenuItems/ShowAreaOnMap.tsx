import noop from 'lodash/noop';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Point } from '../../../../types';
import { SimpleDropdownMenuItem } from '../../../../uiComponents';

type ShowAreaOnMapProps = {
  readonly className?: string;
  readonly netexId: string | null | undefined;
  readonly point: Point | null;
  readonly showOnMap: (netexId: string | undefined, point: Point) => void;
  readonly testId: string;
};

export const ShowAreaOnMap = forwardRef<HTMLButtonElement, ShowAreaOnMapProps>(
  ({ className, netexId, point, showOnMap, testId }, ref) => {
    const { t } = useTranslation();

    return (
      <SimpleDropdownMenuItem
        className={className}
        text={t('stopRegistrySearch.stopRowActions.showOnMap')}
        onClick={point ? () => showOnMap(netexId ?? undefined, point) : noop}
        testId={testId}
        ref={ref}
      />
    );
  }
);

ShowAreaOnMap.displayName = 'ShowAreaOnMap';