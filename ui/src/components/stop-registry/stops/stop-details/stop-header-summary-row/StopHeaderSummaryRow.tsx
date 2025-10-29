import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopRegistryAccessibilityLevel } from '../../../../../generated/graphql';
import { mapStopPlaceStateToUiName } from '../../../../../i18n/uiNameMappings';
import { Visible } from '../../../../../layoutComponents';
import { StopWithDetails } from '../../../../../types';
import { StopPlaceState } from '../../../../../types/stop-registry';
import { StopTypeLabel } from '../StopTypeLabel';
import { NumberDetailItem } from './NumberDetailItem';
import { useGetUniqueLineCountForStopOnDate } from './useGetUniqueLineCountForStopOnDate';
import { VerticalDivider } from './VerticalDivider';

const testIds = {
  accessibleIcon: 'StopHeaderSummaryRow::accessibleIcon',
  lines: 'StopHeaderSummaryRow::lines',
  stopTypes: 'StopHeaderSummaryRow::stopTypes',
  stopState: 'StopHeaderSummaryRow::stopState',
};

type StopHeaderSummaryRowProps = {
  readonly stopDetails: StopWithDetails | null | undefined;
  readonly className?: string;
};

export const StopHeaderSummaryRow: FC<StopHeaderSummaryRowProps> = ({
  stopDetails,
  className = '',
}) => {
  const { t } = useTranslation();

  const { lineCount } = useGetUniqueLineCountForStopOnDate(
    stopDetails?.scheduled_stop_point_id,
  );

  const accessibilityLevel = stopDetails?.quay?.accessibilityLevel;
  const isAccessible =
    accessibilityLevel === StopRegistryAccessibilityLevel.FullyAccessible;
  const anyIconsShown = isAccessible;

  const stopState = stopDetails?.quay?.stopState;
  const showStopState = !!stopState && stopState !== StopPlaceState.InOperation;
  const stopType = stopDetails?.quay?.stopType;
  const showStopType =
    !!stopType && (stopType.railReplacement || stopType.virtual);

  const showStopTypeOrState = showStopState || showStopType;

  return (
    <div className={twMerge(`flex items-center gap-3`, className)}>
      <Visible visible={anyIconsShown}>
        <div className="flex items-center gap-0">
          <Visible visible={isAccessible}>
            <i
              className="icon-accessible text-4xl text-dark-grey"
              title={t('stopDetails.measurements.accessible')}
              data-testid={testIds.accessibleIcon}
            />
          </Visible>
          <VerticalDivider />
        </div>
      </Visible>

      <NumberDetailItem
        count={lineCount}
        translationKey="stopDetails.highlightPropertiesRow.lines"
        testIdPrefix={testIds.lines}
        className={!anyIconsShown ? 'ml-2' : undefined}
      />

      {/* <VerticalDivider /> */}
      {/* TODO: Departures and other non MVP properties */}

      <Visible visible={showStopTypeOrState}>
        <VerticalDivider />
        <div
          className="flex items-center justify-center gap-3"
          data-testid={testIds.stopTypes}
        >
          <StopTypeLabel
            hasType={!!stopType?.railReplacement}
            text={t('stopPlaceTypes.railReplacement')}
          />
          <StopTypeLabel
            hasType={!!stopType?.virtual}
            text={t('stopPlaceTypes.virtual')}
          />
        </div>
        {showStopState && (
          <div
            className="rounded-md bg-dark-grey px-4 py-1 text-center text-sm uppercase leading-normal text-white"
            data-testid={testIds.stopState}
          >
            {mapStopPlaceStateToUiName(t, stopState)}
          </div>
        )}
      </Visible>
    </div>
  );
};
