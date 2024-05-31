import { useTranslation } from 'react-i18next';
import { StopRegistryAccessibilityLevel } from '../../../../generated/graphql';
import { StopWithDetails } from '../../../../hooks';
import { mapStopPlaceStateToUiName } from '../../../../i18n/uiNameMappings';
import { Visible } from '../../../../layoutComponents';
import { StopPlaceState } from '../../../../types/stop-registry';
import { StopTypeLabel } from './StopTypeLabel';

interface Props {
  stopDetails: StopWithDetails;
  className?: string;
}

export const StopHeaderSummaryRow: React.FC<Props> = ({
  stopDetails,
  className = '',
}) => {
  const { t } = useTranslation();

  const accessibilityLevel = stopDetails.stop_place?.accessibilityLevel;
  const isAccessible =
    accessibilityLevel === StopRegistryAccessibilityLevel.FullyAccessible;
  const anyIconsShown = isAccessible;

  const stopState = stopDetails.stop_place?.stopState;

  return (
    <div className={`flex items-center ${className}`}>
      <Visible visible={anyIconsShown}>
        <Visible visible={isAccessible}>
          <i
            className="icon-accessible text-4xl text-dark-grey"
            title={t('stopDetails.measurements.accessible')}
          />
        </Visible>
        <div className="mx-2 h-8 border-l border-dark-grey"> </div>
      </Visible>
      <div className="flex items-center gap-5">
        <StopTypeLabel
          hasType={!!stopDetails?.stop_place?.stopType.mainLine}
          text={t('stopPlaceTypes.mainLine')}
        />
        <StopTypeLabel
          hasType={!!stopDetails?.stop_place?.stopType.interchange}
          text={t('stopPlaceTypes.interchange')}
        />
        <StopTypeLabel
          hasType={!!stopDetails?.stop_place?.stopType.railReplacement}
          text={t('stopPlaceTypes.railReplacement')}
        />
        <StopTypeLabel
          hasType={!!stopDetails?.stop_place?.stopType.virtual}
          text={t('stopPlaceTypes.virtual')}
        />
        {stopState && stopState !== StopPlaceState.InOperation && (
          <div className="rounded-md bg-dark-grey px-4 py-1 text-center text-sm uppercase leading-normal text-white">
            {mapStopPlaceStateToUiName(stopState)}
          </div>
        )}
      </div>
    </div>
  );
};
