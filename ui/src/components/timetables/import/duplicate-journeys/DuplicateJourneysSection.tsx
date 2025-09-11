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
  className = '',
  duplicateJourneys,
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
            <th>{t('timetablesPreview.tableHeaders.routeLabel')}</th>
            <th>{t('timetablesPreview.tableHeaders.departureTime')}</th>
            <th>{t('timetablesPreview.tableHeaders.dayType')}</th>
            <th>{t('timetablesPreview.tableHeaders.validityStarts')}</th>
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <th className="!px-2"> </th>
            <th className="!pl-0">
              {t('timetablesPreview.tableHeaders.validityEnds')}
            </th>
            <th>{t('timetablesPreview.tableHeaders.contractNumber')}</th>
            <th className="w-full">{/* Filler */}</th>
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
