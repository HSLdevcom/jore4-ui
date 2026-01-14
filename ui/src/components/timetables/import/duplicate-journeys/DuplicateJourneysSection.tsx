import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleJourneyDuplicate } from '../hooks';
import { VehicleJourneyRow } from './VehicleJourneyRow';

const testIds = {
  table: 'DuplicateJourneysSection::table',
};

type DuplicateJourneysSectionProps = {
  readonly className?: string;
  readonly duplicateJourneys: ReadonlyArray<VehicleJourneyDuplicate>;
};

export const DuplicateJourneysSection: FC<DuplicateJourneysSectionProps> = ({
  className,
  duplicateJourneys,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h3 className="my-2">{t('timetablesPreview.duplicateJourneys.title')}</h3>
      <p>{t('timetablesPreview.duplicateJourneys.description')}</p>

      <table
        className="my-4 w-full text-left whitespace-nowrap"
        data-testid={testIds.table}
      >
        <thead>
          <tr className="font-normal">
            <th className="px-8 py-2">
              {t('timetablesPreview.tableHeaders.routeLabel')}
            </th>
            <th className="px-8 py-2">
              {t('timetablesPreview.tableHeaders.departureTime')}
            </th>
            <th className="px-8 py-2">
              {t('timetablesPreview.tableHeaders.dayType')}
            </th>
            <th className="px-8 py-2">
              {t('timetablesPreview.tableHeaders.validityStarts')}
            </th>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th className="px-2 py-2"> </th>
            <th className="py-2 pr-2 pl-0">
              {t('timetablesPreview.tableHeaders.validityEnds')}
            </th>
            <th className="px-8 py-2">
              {t('timetablesPreview.tableHeaders.contractNumber')}
            </th>
            <th className="w-full px-8 py-2">{/* Filler */}</th>
          </tr>
        </thead>
        <tbody className="border-brand-gray w-full border">
          {duplicateJourneys.map((journeyDuplicate) => (
            <VehicleJourneyRow
              key={journeyDuplicate.stagingJourney.vehicleJourneyId}
              vehicleJourneyInfo={journeyDuplicate.stagingJourney}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
