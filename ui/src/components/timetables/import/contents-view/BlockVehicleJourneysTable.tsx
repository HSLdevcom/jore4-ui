import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TimetablesVehicleTypeVehicleType,
  VehicleJourneyWithRouteInfoFragment,
  VehicleServiceWithJourneysFragment,
} from '../../../../generated/graphql';
import { useToggle } from '../../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { Row, Visible } from '../../../../layoutComponents';
import { AccordionButton } from '../../../../uiComponents';
import { VehicleJourneyRow } from './VehicleJourneyRow';

const testIds = {
  table: 'BlockVehicleJourneysTable::table',
  blockLabel: 'BlockVehicleJourneysTable::blockLabel',
  toggleShowTable: 'BlockVehicleJourneysTable::toggleShowTable',
  titleRow: 'BlockVehicleJourneysTable::titleRow',
  vehicleType: 'BlockVehicleJourneysTable::vehicleType',
  vehicleJourneyHeaders: 'BlockVehicleJourneysTable::vehicleJourneyHeaders',
};
export const blockVehicleJourneysTableTestIds = testIds;

type BlockVehicleJourneysTableProps = {
  readonly vehicleJourneys: ReadonlyArray<VehicleJourneyWithRouteInfoFragment>;
  readonly vehicleService: VehicleServiceWithJourneysFragment;
  readonly vehicleType:
    | Pick<TimetablesVehicleTypeVehicleType, 'description_i18n'>
    | null
    | undefined;
  readonly blockLabel: string;
  readonly vehicleScheduleFrameLabel: string;
};

export const BlockVehicleJourneysTable: FC<BlockVehicleJourneysTableProps> = ({
  vehicleJourneys,
  vehicleService,
  vehicleType,
  blockLabel,
  vehicleScheduleFrameLabel,
}) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const [isOpen, toggleIsOpen] = useToggle();

  const identifier = `${vehicleScheduleFrameLabel} ${blockLabel}`;

  return (
    <table
      className="border-brand-gray w-full border"
      data-testid={testIds.table}
      id={identifier}
    >
      <thead className="[&>tr>th]:border [&>tr>th]:border-light-grey">
        <tr data-testid={testIds.titleRow}>
          <th
            data-testid={testIds.blockLabel}
            className="w-1/6 bg-brand px-6 py-2 text-left text-white"
          >
            {blockLabel}
          </th>
          <th
            className="border-l border-l-white bg-white px-4 py-2 text-left text-hsl-dark-80"
            colSpan={4}
          >
            <Row className="flex-1 items-center justify-between font-normal">
              <p data-testid={testIds.vehicleType}>
                {vehicleType &&
                  t('timetablesPreview.vehicleType', {
                    vehicleTypeName: getLocalizedTextFromDbBlob(
                      vehicleType.description_i18n,
                    ),
                  })}
              </p>
              <AccordionButton
                testId={testIds.toggleShowTable}
                isOpen={isOpen}
                onToggle={toggleIsOpen}
                iconClassName="text-brand text-[50px]"
                openTooltip={t(
                  'accessibility:timetables.expandScheduleBlocksPreview',
                  { scheduleBlock: identifier },
                )}
                closeTooltip={t(
                  'accessibility:timetables.closeScheduleBlocksPreview',
                  { scheduleBlock: identifier },
                )}
                controls={identifier}
              />
            </Row>
          </th>
        </tr>
        {isOpen && (
          <tr
            className="bg-white [&>th]:px-5 [&>th]:py-2 [&>th]:text-left [&>th]:font-normal"
            data-testid={testIds.vehicleJourneyHeaders}
          >
            <th>{t('timetablesPreview.tableHeaders.routeLabel')}</th>
            <th>{t('timetablesPreview.tableHeaders.dayType')}</th>
            <th>{t('timetablesPreview.tableHeaders.departureTime')}</th>
            <th>{t('timetablesPreview.tableHeaders.endTime')}</th>
            <th>{t('timetablesPreview.tableHeaders.contractNumber')}</th>
          </tr>
        )}
      </thead>
      <Visible visible={isOpen}>
        <tbody>
          {vehicleJourneys.map((vehicleJourney) => (
            <VehicleJourneyRow
              key={vehicleJourney.vehicle_journey_id}
              vehicleJourney={vehicleJourney}
              vehicleService={vehicleService}
            />
          ))}
        </tbody>
      </Visible>
    </table>
  );
};
