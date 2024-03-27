import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
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
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex gap-5">
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
      </div>
    </div>
  );
};
