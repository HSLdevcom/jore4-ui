import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameWithRouteInfoFragment } from '../../../generated/graphql';
import { useToggle } from '../../../hooks';
import { parseI18nField } from '../../../i18n/utils';
import { Row, Visible } from '../../../layoutComponents';
import { mapToShortDate } from '../../../time';
import { AccordionButton } from '../../../uiComponents';
import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

const testIds = {
  frameBlocks: (label: string) =>
    `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
  toggleShowTable: 'VehicleScheduleFrameBlocksView::toggleShowTable',
  validityTimeRangeText:
    'VehicleScheduleFrameBlocksView::validityTimeRangeText',
};

interface Props {
  vehicleScheduleFrame: VehicleScheduleFrameWithRouteInfoFragment;
}

export const VehicleScheduleFrameBlocksView = ({
  vehicleScheduleFrame,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, toggleIsOpen] = useToggle(true);

  const blocks = vehicleScheduleFrame.vehicle_services.flatMap((service) =>
    // TODO: Get Block label from vehicle service after it has been implemented to data model
    service.blocks.map((block) => ({
      label: parseI18nField(service.name_i18n),
      block,
    })),
  );

  const { validity_start: validityStart, validity_end: validityEnd } =
    vehicleScheduleFrame;

  const validityPeriodString = `${mapToShortDate(
    validityStart,
  )} - ${mapToShortDate(validityEnd)}`;

  const blockCountString = `${t('timetablesPreview.blockCount', {
    count: blocks.length,
  })}`;

  const vehicleScheduleFrameTitleText = [
    validityPeriodString,
    blockCountString,
  ].join(' | ');

  return (
    <div data-testid={testIds.frameBlocks(vehicleScheduleFrame.label)}>
      <Row className="border-brand-gray w-full border text-white">
        <p className="flex w-1/6 items-center border border-light-grey bg-brand py-2 px-6 font-bold">
          {vehicleScheduleFrame.label}
        </p>
        <Row className="flex-1 border border-l border-light-grey border-l-white bg-brand py-2 px-4">
          <Row className="flex-1 items-center justify-between font-normal">
            <p data-testid={testIds.validityTimeRangeText}>
              {vehicleScheduleFrameTitleText}
            </p>
            <AccordionButton
              testId={testIds.toggleShowTable}
              isOpen={isOpen}
              onToggle={toggleIsOpen}
              iconClassName="text-white text-[50px]"
            />
          </Row>
        </Row>
      </Row>

      <Visible visible={isOpen}>
        <div className="my-4 space-y-4">
          {blocks.map((block) => (
            <BlockVehicleJourneysTable
              key={block.block.block_id}
              title={block.label}
              vehicleJourneys={block.block.vehicle_journeys}
            />
          ))}
        </div>
      </Visible>
    </div>
  );
};
