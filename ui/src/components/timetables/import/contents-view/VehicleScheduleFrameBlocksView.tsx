import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleScheduleFrameWithRouteInfoFragment } from '../../../../generated/graphql';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { Row, Visible } from '../../../../layoutComponents';
import { mapToShortDate } from '../../../../time';
import { AccordionButton } from '../../../../uiComponents';
import { useToggle } from '../../../common/hooks';
import { BlockVehicleJourneysTable } from './BlockVehicleJourneysTable';

const testIds = {
  frameBlocks: (label: string) =>
    `VehicleScheduleFrameBlocksView::frameBlocks::${label}`,
  toggleShowTable: 'VehicleScheduleFrameBlocksView::toggleShowTable',
  frameTitleRow: 'VehicleScheduleFrameBlocksView::frameTitleRow',
  frameLabel: 'VehicleScheduleFrameBlocksView::frameLabel',
  validityTimeRangeText:
    'VehicleScheduleFrameBlocksView::validityTimeRangeText',
};
export const vehicleScheduleFrameBlocksViewTestIds = testIds;

type VehicleScheduleFrameBlocksViewProps = {
  readonly vehicleScheduleFrame: VehicleScheduleFrameWithRouteInfoFragment;
};

export const VehicleScheduleFrameBlocksView: FC<
  VehicleScheduleFrameBlocksViewProps
> = ({ vehicleScheduleFrame }) => {
  const { t } = useTranslation();
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const [isOpen, toggleIsOpen] = useToggle(true);

  const blocks = vehicleScheduleFrame.vehicle_services.flatMap((service) =>
    service.blocks.map((block) => ({
      label: getLocalizedTextFromDbBlob(service.name_i18n),
      service,
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
  const vehicleScheduleFrameLabel = vehicleScheduleFrame.label;
  const vehicleScheduleFrameBlocksId = `${vehicleScheduleFrameLabel}Blocks`;
  return (
    <div data-testid={testIds.frameBlocks(vehicleScheduleFrameLabel)}>
      <Row
        testId={testIds.frameTitleRow}
        className="border-brand-gray w-full border text-white"
      >
        <p
          data-testid={testIds.frameLabel}
          className="flex w-1/6 items-center border border-light-grey bg-brand px-6 py-2 font-bold"
        >
          {vehicleScheduleFrameLabel}
        </p>
        <Row className="flex-1 border border-l border-light-grey border-l-white bg-brand px-4 py-2">
          <Row className="flex-1 items-center justify-between font-normal">
            <p data-testid={testIds.validityTimeRangeText}>
              {vehicleScheduleFrameTitleText}
            </p>
            <AccordionButton
              testId={testIds.toggleShowTable}
              isOpen={isOpen}
              onToggle={toggleIsOpen}
              iconClassName="text-white text-[50px]"
              openTooltip={t('accessibility:timetables.expandSchedulePreview', {
                vehicleScheduleFrameLabel,
              })}
              closeTooltip={t('accessibility:timetables.closeSchedulePreview', {
                vehicleScheduleFrameLabel,
              })}
              controls={vehicleScheduleFrameBlocksId}
            />
          </Row>
        </Row>
      </Row>

      <Visible visible={isOpen}>
        <div id={vehicleScheduleFrameBlocksId} className="my-4 space-y-4">
          {blocks.map((block) => (
            <BlockVehicleJourneysTable
              key={block.block.block_id}
              blockLabel={block.label}
              vehicleScheduleFrameLabel={vehicleScheduleFrameLabel}
              vehicleJourneys={block.block.vehicle_journeys}
              vehicleService={block.service}
              vehicleType={block.block.vehicle_type}
            />
          ))}
        </div>
      </Visible>
    </div>
  );
};
