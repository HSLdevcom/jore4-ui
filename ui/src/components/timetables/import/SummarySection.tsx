import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameInfo } from '../../../hooks/vehicle-schedule-frame/useVehicleScheduleFramesToVehicleScheduleFrameInfo';
import { Visible } from '../../../layoutComponents/Visible';
import { DeviationSection } from './DeviationSection';

interface Props {
  deviations: VehicleScheduleFrameInfo[];
  className?: string;
}

export const SummarySection = ({ className = '', deviations }: Props) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h2>{t('timetablesPreview.summary')}</h2>
      <Visible visible={deviations.length > 0}>
        <DeviationSection
          className="mt-8 rounded-lg border bg-white px-12 py-6"
          routeDeviations={deviations}
        />
      </Visible>
    </div>
  );
};
