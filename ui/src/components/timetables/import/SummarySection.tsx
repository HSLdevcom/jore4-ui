import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleJourneyDuplicate } from '../../../hooks/timetables-import/deviations/duplicate-journeys/useFindDuplicateJourneys';
import { VehicleScheduleFrameInfo } from '../../../hooks/timetables-import/deviations/useCreateVehicleScheduleFrameInfo';
import { Visible } from '../../../layoutComponents/Visible';
import { DeviationSection } from './DeviationSection';
import { DuplicateJourneysSection } from './duplicate-journeys';

interface Props {
  deviations: VehicleScheduleFrameInfo[];
  duplicateJourneys: VehicleJourneyDuplicate[];
  className?: string;
}

export const SummarySection = ({
  className = '',
  deviations,
  duplicateJourneys,
}: Props) => {
  const [showDeviationSection, setShowDeviationSection] =
    useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    setShowDeviationSection(true);
  }, [deviations]);

  return (
    <div className={className}>
      <h2>{t('timetablesPreview.summary')}</h2>
      {/* TODO: maybe rename this to "missing route deviations" or something. */}
      <Visible visible={deviations.length > 0 && showDeviationSection}>
        <DeviationSection
          className="mt-8 rounded-lg border bg-white px-12 py-6"
          routeDeviations={deviations}
          handleClose={() => setShowDeviationSection(false)}
        />
      </Visible>

      <Visible visible={!!duplicateJourneys.length}>
        <DuplicateJourneysSection duplicateJourneys={duplicateJourneys} />
      </Visible>
    </div>
  );
};
