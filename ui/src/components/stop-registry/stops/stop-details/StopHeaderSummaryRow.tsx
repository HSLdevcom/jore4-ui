import { useTranslation } from 'react-i18next';
import { StopWithDetails } from '../../../../hooks';
import { StopTypeBox } from './StopTypeBox';

interface Props {
  stopDetails: StopWithDetails;
}

export const StopHeaderSummaryRow: React.FC<Props> = ({ stopDetails }) => {
  const { t } = useTranslation();
  return (
    <div className="my-2 flex items-center">
      <div className="flex gap-1.5">
        <StopTypeBox
          hasType={!!stopDetails?.stop_place?.stopType.mainLine}
          text={t('stopPlaceTypes.mainLine')}
        />
        <StopTypeBox
          hasType={!!stopDetails?.stop_place?.stopType.interchange}
          text={t('stopPlaceTypes.interchange')}
        />
        <StopTypeBox
          hasType={!!stopDetails?.stop_place?.stopType.railReplacement}
          text={t('stopPlaceTypes.railReplacement')}
        />
        <StopTypeBox
          hasType={!!stopDetails?.stop_place?.stopType.virtual}
          text={t('stopPlaceTypes.virtual')}
        />
      </div>
    </div>
  );
};
