import {
  MON_FRI_DAY_TYPE,
  SAT_DAY_TYPE,
  SUN_DAY_TYPE,
  buildLocalizedString,
} from '@hsl/jore4-test-db-manager';
import cloneDeep from 'lodash/cloneDeep';
import { DateTime, Duration } from 'luxon';
import {
  RouteDirectionEnum,
  VehicleJourneyWithRouteInfoFragment,
  VehicleScheduleFrameWithRouteInfoFragment,
} from '../../../../generated/graphql';
import { Priority, TimetablePriority } from '../../../../types/enums';
import { fireEvent, render, within } from '../../../../utils/test-utils';
import { directionBadgeTestIds } from '../../../routes-and-lines/line-details/DirectionBadge';
import { blockVehicleJourneysTableTestIds } from './BlockVehicleJourneysTable';
import { ImportContentsView } from './ImportContentsView';
import { vehicleJourneyRowTestIds } from './VehicleJourneyRow';
import { vehicleScheduleFrameBlocksViewTestIds } from './VehicleScheduleFrameBlocksView';

const route35JourneyPatternRef: VehicleJourneyWithRouteInfoFragment['journey_pattern_ref'] =
  {
    journey_pattern_ref_id: 'ee46b39c-53f1-4559-943c-b56c5f8528e9',
    journey_pattern_instance: {
      journey_pattern_id: '75dc1d71-6508-408d-abbc-95723747b28a',
      journey_pattern_route: {
        route_id: '8bb0200f-cf1a-4c23-ab9c-5a376c30704f',
        direction: RouteDirectionEnum.Outbound,
        label: '35',
        variant: null,
        name_i18n: buildLocalizedString('Niemenmäki-Munkkivuori-Rakuunantie'),
        description_i18n: buildLocalizedString(
          'Niemenmäki-Munkkivuori-Rakuunantie',
        ),
        origin_name_i18n: {},
        origin_short_name_i18n: {},
        destination_name_i18n: {},
        destination_short_name_i18n: {},
        on_line_id: '',
        priority: Priority.Standard,
      },
    },
  };

const route35ReturnJourneyPatternRef: VehicleJourneyWithRouteInfoFragment['journey_pattern_ref'] =
  {
    journey_pattern_ref_id: '0262bd31-f844-47d8-a7c3-e8fd9bd20729',
    journey_pattern_instance: {
      journey_pattern_id: '05195ceb-614f-4d62-960e-65a47931d362',
      journey_pattern_route: {
        route_id: '20762e4f-5bb6-4635-a041-bd11c85bad3b',
        direction: RouteDirectionEnum.Inbound,
        label: '35',
        variant: null,
        name_i18n: buildLocalizedString('Niemenmäki-Munkkivuori-Rakuunantie'),
        description_i18n: buildLocalizedString(
          'Niemenmäki-Munkkivuori-Rakuunantie',
        ),
        origin_name_i18n: {},
        origin_short_name_i18n: {},
        destination_name_i18n: {},
        destination_short_name_i18n: {},
        on_line_id: '',
        priority: Priority.Standard,
      },
    },
  };

const testFrame1: VehicleScheduleFrameWithRouteInfoFragment = {
  vehicle_schedule_frame_id: '0d55f677-d8c5-4917-b73d-a055411d96f3',
  label: 'SUMMER_SCHEDULES',
  validity_start: DateTime.fromISO('2023-06-01'),
  validity_end: DateTime.fromISO('2023-08-31'),
  name_i18n: buildLocalizedString('Summer schedules'),
  priority: TimetablePriority.Standard,
  vehicle_services: [
    {
      vehicle_service_id: '56d93b15-a15f-473e-b60e-69a0b32d070c',
      name_i18n: buildLocalizedString('Week day service'),
      day_type: {
        day_type_id: MON_FRI_DAY_TYPE,
        label: 'MP',
        name_i18n: buildLocalizedString('Maanantai - Perjantai'),
      },
      blocks: [
        {
          block_id: '8fdd3bd1-4015-4856-bd16-fec4f82ad940',
          vehicle_type: {
            vehicle_type_id: '51de7bcc-ba37-4d10-9df6-dccac59a2dae',
            description_i18n: {
              fi_FI: 'Mini B',
            },
          },
          vehicle_journeys: [
            {
              vehicle_journey_id: 'cd28a717-615e-418e-b0e6-c1897aeaae80',
              start_time: Duration.fromISO('PT15H00M'),
              end_time: Duration.fromISO('PT15H25M'),
              contract_number: 'CONTRACT_1',
              journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
            },
            {
              vehicle_journey_id: '806276a3-5308-45d0-b25b-e80787139fc7',
              start_time: Duration.fromISO('PT15H30M'),
              end_time: Duration.fromISO('PT15H55M'),
              contract_number: 'CONTRACT_1',
              journey_pattern_ref: cloneDeep(route35ReturnJourneyPatternRef),
            },
            {
              vehicle_journey_id: 'cfc9b82c-6b6b-494c-9f4d-bb80d8385232',
              start_time: Duration.fromISO('PT16H00M'),
              end_time: Duration.fromISO('PT16H25M'),
              contract_number: 'CONTRACT_1',
              journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
            },
          ],
        },
      ],
    },
    {
      vehicle_service_id: '05b4e213-50e5-491e-b44f-5a9c1e4adff9',
      name_i18n: buildLocalizedString('Saturday service'),
      day_type: {
        day_type_id: SAT_DAY_TYPE,
        label: 'LA',
        name_i18n: buildLocalizedString('Lauantai'),
      },
      blocks: [
        {
          block_id: '5c88a3a2-b57e-42a9-a357-b8f49562dfb4',
          vehicle_type: {
            vehicle_type_id: 'd5eb9264-16af-4e19-b058-a0ae0da38da7',
            description_i18n: {
              fi_FI: 'Mini B',
            },
          },
          vehicle_journeys: [
            {
              vehicle_journey_id: 'cc77a08e-3e59-4dc7-84a2-fc0d65b5a649',
              start_time: Duration.fromISO('PT08H00M'),
              end_time: Duration.fromISO('PT08H25M'),
              contract_number: 'CONTRACT_1',
              journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
            },
          ],
        },
      ],
    },
  ],
};

const testFrame2: VehicleScheduleFrameWithRouteInfoFragment = {
  label: 'AUTUMN_SCHEDULES',
  validity_start: DateTime.fromISO('2023-09-01'),
  validity_end: DateTime.fromISO('2023-12-31'),
  name_i18n: buildLocalizedString('Autumn schedules'),
  vehicle_schedule_frame_id: '0d55f677-d8c5-4917-b73d-a055411d96f3',
  priority: TimetablePriority.Standard,
  vehicle_services: [
    {
      vehicle_service_id: '72db0788-0abb-40b1-9bec-2692e2026d72',
      name_i18n: buildLocalizedString('Sunday service'),
      day_type: {
        day_type_id: SUN_DAY_TYPE,
        label: 'SU',
        name_i18n: buildLocalizedString('Sunnuntai'),
      },
      blocks: [
        {
          block_id: '8b2ffb30-5098-4fde-bb29-74b0dc25c78e',
          vehicle_type: {
            vehicle_type_id: 'bfe09e9f-6749-478c-b8f7-a6ac3b191d06',
            description_i18n: {
              fi_FI: 'Mini A',
            },
          },
          vehicle_journeys: [
            {
              vehicle_journey_id: '048264df-ae24-43bd-a06b-96674973c1f2',
              start_time: Duration.fromISO('PT10H00M'),
              end_time: Duration.fromISO('PT10H45M'),
              contract_number: 'CONTRACT_2',
              journey_pattern_ref: cloneDeep(route35JourneyPatternRef),
            },
          ],
        },
      ],
    },
  ],
};

describe('<ImportContentsView />', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1, testFrame2]} />,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should render an expanded block correctly', () => {
    const { getAllByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1]} />,
    );

    const block = getAllByTestId(blockVehicleJourneysTableTestIds.table)[0];
    const toggleShowFirstBlock = within(block).getByTestId(
      blockVehicleJourneysTableTestIds.toggleShowTable,
    );

    // Expand the block.
    fireEvent.click(toggleShowFirstBlock);
    const vehicleJourneyRowOutbound = within(block).getAllByTestId(
      vehicleJourneyRowTestIds.vehicleJourneyRow('35', 'outbound'),
    )[0];
    expect(vehicleJourneyRowOutbound).toBeVisible();

    expect(block).toMatchSnapshot();
  });

  it('should show frame details correctly', () => {
    const { getAllByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1]} />,
    );

    expect(
      getAllByTestId(vehicleScheduleFrameBlocksViewTestIds.frameLabel)[0],
    ).toHaveTextContent('SUMMER_SCHEDULES');

    expect(
      getAllByTestId(
        vehicleScheduleFrameBlocksViewTestIds.validityTimeRangeText,
      )[0],
    ).toHaveTextContent('1.6.2023 - 31.8.2023 | 2 autokiertoa');

    expect(getAllByTestId(blockVehicleJourneysTableTestIds.table).length).toBe(
      2,
    );
  });

  it('should show service and block details correctly', () => {
    const { getByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1]} />,
    );

    const block = within(
      getByTestId(
        vehicleScheduleFrameBlocksViewTestIds.frameBlocks('SUMMER_SCHEDULES'),
      ),
    ).getAllByTestId(blockVehicleJourneysTableTestIds.table)[0];

    expect(
      within(block).getByTestId(blockVehicleJourneysTableTestIds.title),
    ).toHaveTextContent('Week day service');
    expect(
      within(block).getByTestId(blockVehicleJourneysTableTestIds.vehicleType),
    ).toHaveTextContent('Kalustotyyppi - Mini B');
  });

  it('should show vehicle journey rows correctly', () => {
    const { getAllByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1]} />,
    );

    const block = getAllByTestId(blockVehicleJourneysTableTestIds.table)[0];
    const toggleShowFirstBlock = within(block).getByTestId(
      blockVehicleJourneysTableTestIds.toggleShowTable,
    );

    // Toggle open.
    fireEvent.click(toggleShowFirstBlock);
    const vehicleJourneyRowOutbound = within(block).getAllByTestId(
      vehicleJourneyRowTestIds.vehicleJourneyRow('35', 'outbound'),
    )[0];
    const vehicleJourneyRowInbound = within(block).getAllByTestId(
      vehicleJourneyRowTestIds.vehicleJourneyRow('35', 'inbound'),
    )[0];
    expect(vehicleJourneyRowOutbound).toBeVisible();

    const queryFromOutboundRow = within(
      vehicleJourneyRowOutbound,
    ).queryByTestId;

    expect(
      queryFromOutboundRow(vehicleJourneyRowTestIds.dateTypeName),
    ).toHaveTextContent('Maanantai - Perjantai');
    expect(
      queryFromOutboundRow(vehicleJourneyRowTestIds.startTime),
    ).toHaveTextContent('15:00');
    expect(
      queryFromOutboundRow(vehicleJourneyRowTestIds.endTime),
    ).toHaveTextContent('15:25');
    expect(
      queryFromOutboundRow(vehicleJourneyRowTestIds.contractNumber),
    ).toHaveTextContent('CONTRACT_1');
    expect(
      queryFromOutboundRow(directionBadgeTestIds.container),
    ).toHaveAttribute('title', '1 - Keskustasta pois');

    // Different direction row.
    expect(
      within(vehicleJourneyRowInbound).queryByTestId(
        directionBadgeTestIds.container,
      ),
    ).toHaveAttribute('title', '2 - Keskustaan päin');
  });

  it('should be able to toggle individual frame details open', () => {
    const { getByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1, testFrame2]} />,
    );

    const summerFrame = getByTestId(
      vehicleScheduleFrameBlocksViewTestIds.frameBlocks('SUMMER_SCHEDULES'),
    );
    const autumnFrame = getByTestId(
      vehicleScheduleFrameBlocksViewTestIds.frameBlocks('AUTUMN_SCHEDULES'),
    );
    const toggleShowSummerFrame = within(summerFrame).getAllByTestId(
      vehicleScheduleFrameBlocksViewTestIds.toggleShowTable,
    )[0];

    const queryBlocks = (frame: HTMLElement) =>
      within(frame).queryAllByTestId(blockVehicleJourneysTableTestIds.table);

    // Initially open.
    expect(queryBlocks(summerFrame)[0]).toBeVisible();

    // Toggle closed.
    fireEvent.click(toggleShowSummerFrame);
    expect(queryBlocks(summerFrame)).toHaveLength(0);

    // Toggling should not affect another frame.
    expect(queryBlocks(autumnFrame)[0]).toBeVisible();

    // Toggle back open.
    fireEvent.click(toggleShowSummerFrame);
    expect(queryBlocks(summerFrame)[0]).toBeVisible();
  });

  it('should be able to toggle individual block details open', () => {
    const { getAllByTestId } = render(
      <ImportContentsView vehicleScheduleFrames={[testFrame1]} />,
    );

    const blocks = getAllByTestId(blockVehicleJourneysTableTestIds.table);
    const toggleShowFirstBlock = within(blocks[0]).getByTestId(
      blockVehicleJourneysTableTestIds.toggleShowTable,
    );

    const queryJourneyRow = (block: HTMLElement) =>
      within(block).queryAllByTestId(
        vehicleJourneyRowTestIds.vehicleJourneyRow('35', 'outbound'),
      );

    // Initially hidden.
    expect(queryJourneyRow(blocks[0])).toHaveLength(0);

    // Toggle open.
    fireEvent.click(toggleShowFirstBlock);
    expect(queryJourneyRow(blocks[0])[0]).toBeVisible();

    // Toggling should not affect another block.
    expect(queryJourneyRow(blocks[1])).toHaveLength(0);

    // Toggle back closed.
    fireEvent.click(toggleShowFirstBlock);
    expect(queryJourneyRow(blocks[0])).toHaveLength(0);
  });
});
