import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameWithRouteInfoFragment } from '../../../generated/graphql';
import { Row, Visible } from '../../../layoutComponents';
import { AccordionButton } from '../../../uiComponents';
import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

interface Props {
  vehicleScheduleFrame: VehicleScheduleFrameWithRouteInfoFragment;
}

const testIds = {
  table: 'VehicleScheduleFrameBlocksView::table',
  toggleShowTable: 'VehicleScheduleFrameBlocksView::toggleShowTable',
};

export const VehicleScheduleFrameBlocksView = ({
  vehicleScheduleFrame,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useReducer((value) => !value, true);

  const blocks = vehicleScheduleFrame.vehicle_services.flatMap((service) =>
    // TODO: Get Block label from vehicle service after it has been implemented to data model
    service.blocks.map((block) => ({ label: '!Block label', block })),
  );

  return (
    <div>
      <Row className="border-brand-gray w-full border text-white">
        <Row className="w-64 items-center border border-light-grey bg-brand py-2 px-6 font-bold">
          !Aikataulun nimi
        </Row>
        <Row className="flex-1 border border-l border-light-grey border-l-white bg-brand py-2 px-4">
          <Row className="flex-1 items-center justify-between font-normal">
            {t('timetablesPreview.blockCount', {
              count: blocks.length,
            })}
            <AccordionButton
              testId={testIds.toggleShowTable}
              isOpen={isOpen}
              onToggle={setIsOpen}
              iconClassName="text-white text-[50px]"
            />
          </Row>
        </Row>
      </Row>

      <Visible visible={isOpen}>
        <div className="my-4 space-y-4">
          {blocks.map((block) => (
            <BlockVehicleJourneysTable
              key={block.label}
              title={block.label}
              vehicleJourneys={block.block.vehicle_journeys}
            />
          ))}
        </div>
      </Visible>
    </div>
  );
};
