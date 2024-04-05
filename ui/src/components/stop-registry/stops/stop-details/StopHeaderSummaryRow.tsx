import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { mapStopPlaceStateToUiName } from '../../../../i18n/uiNameMappings';
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
  const stopState = stopDetails.stop_place?.stopState;

  return (
    <div className={`flex ${className}`}>
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
          <div className="rounded-md bg-dark-grey py-1 px-4 text-center text-sm uppercase leading-normal text-white">
            {mapStopPlaceStateToUiName(stopState)}
          </div>
        )}
      </div>
    </div>
  );
};
