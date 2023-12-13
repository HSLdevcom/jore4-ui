import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  VehicleJourneyDuplicate,
  VehicleScheduleFrameInfo,
} from '../../../hooks';
import { Visible } from '../../../layoutComponents/Visible';
import { DuplicateJourneysSection } from './duplicate-journeys';
import { MissingRouteDeviationsSection } from './missing-route-deviations';

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

      <Visible visible={deviations.length > 0 && showDeviationSection}>
        <MissingRouteDeviationsSection
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
