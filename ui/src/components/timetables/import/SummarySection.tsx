import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameInfo } from '../../../hooks/timetables-import/deviations/useCreateVehicleScheduleFrameInfo';
import { Visible } from '../../../layoutComponents/Visible';
import { DeviationSection } from './DeviationSection';

interface Props {
  deviations: VehicleScheduleFrameInfo[];
  className?: string;
}

export const SummarySection = ({ className = '', deviations }: Props) => {
  const [showDeviationSection, setShowDeviationSection] =
    useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    setShowDeviationSection(true);
  }, [deviations]);

  return (
    <div className={className}>
      <h2>{t('timetablesPreview.summary')}</h2>
      <Visible visible={deviations.length > 0 && showDeviationSection}>
        <DeviationSection
          className="mt-8 rounded-lg border bg-white px-12 py-6"
          routeDeviations={deviations}
          handleClose={() => setShowDeviationSection(false)}
        />
      </Visible>
    </div>
  );
};
