import { useTranslation } from 'react-i18next';
import { VehicleJourneyDuplicate } from '../../../../hooks';
import { VehicleJourneyRow } from './VehicleJourneyRow';

const testIds = {
  table: 'DuplicateJourneysSection::table',
};

export const DuplicateJourneysSection = ({
  className = '',
  duplicateJourneys,
}: {
  className?: string;
  duplicateJourneys: VehicleJourneyDuplicate[];
}) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h3 className="my-2">{t('timetablesPreview.duplicateJourneys.title')}</h3>
      <p>{t('timetablesPreview.duplicateJourneys.description')}</p>

      <table
        className="my-4 w-full whitespace-nowrap text-left"
        data-testid={testIds.table}
      >
        <thead>
          <tr className="[&>th]:p-2 [&>th]:px-8 [&>th]:font-normal">
            <th>{t('timetablesPreview.duplicateJourneys.label')}</th>
            <th>{t('timetablesPreview.duplicateJourneys.departureTime')}</th>
            <th>{t('timetablesPreview.duplicateJourneys.dayType')}</th>
            <th className="!pr-0">
              {t('timetablesPreview.duplicateJourneys.validityStarts')}
            </th>
            <th className="!px-2"> </th>
            <th className="!pl-0">
              {t('timetablesPreview.duplicateJourneys.validityEnds')}
            </th>
            <th className="w-[100%]">{/* Filler */}</th>
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
