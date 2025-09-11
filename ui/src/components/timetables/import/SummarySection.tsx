import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdWarning } from 'react-icons/md';
import { Visible } from '../../../layoutComponents/Visible';
import { DuplicateJourneysSection } from './duplicate-journeys';
import { VehicleJourneyDuplicate, VehicleScheduleFrameInfo } from './hooks';
import { MissingRouteDeviationsSection } from './missing-route-deviations';

type SummarySectionProps = {
  readonly deviations: ReadonlyArray<VehicleScheduleFrameInfo>;
  readonly duplicateJourneys: ReadonlyArray<VehicleJourneyDuplicate>;
  readonly className?: string;
};

export const SummarySection: FC<SummarySectionProps> = ({
  className = '',
  deviations: routeDeviations,
  duplicateJourneys,
}) => {
  const [showDeviationSection, setShowDeviationSection] =
    useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    setShowDeviationSection(true);
  }, [routeDeviations]);

  const totalDeviations = routeDeviations.length + duplicateJourneys.length;

  return (
    <div className={className}>
      <h2>{t('timetablesPreview.summary')}</h2>

      <Visible visible={totalDeviations > 0}>
        <div className="my-4 items-center space-y-4 rounded border px-16 py-6">
          <h3>
            <MdWarning
              className="mr-2 inline h-6 w-6 text-hsl-red"
              role="img"
              title={t('timetablesPreview.attention')}
            />
            {t('timetablesPreview.deviations', { count: totalDeviations })}
          </h3>

          <Visible visible={routeDeviations.length > 0 && showDeviationSection}>
            <MissingRouteDeviationsSection
              routeDeviations={routeDeviations}
              handleClose={() => setShowDeviationSection(false)}
            />
          </Visible>

          <Visible visible={!!duplicateJourneys.length}>
            <DuplicateJourneysSection duplicateJourneys={duplicateJourneys} />
          </Visible>
        </div>
      </Visible>
    </div>
  );
};
