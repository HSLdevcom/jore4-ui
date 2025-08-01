import { buildLocalizedString, buildRoute } from '@hsl/jore4-test-db-manager';
import {
  LineTableRowFragment,
  RouteDirectionEnum,
  RouteTableRowFragment,
} from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import { render } from '../../../utils/test-utils';
import { RouteLineTableRowVariant, RouteTableRow } from '../../common';
import { LineTableRow } from '../../common/LineTableRow';
import { RoutesTable } from './RoutesTable';

describe(`<${RoutesTable.name} />`, () => {
  const testId = 'routesTable1';
  const route1Id = '03d55414-e5cf-4cce-9faf-d86ccb7e5f98';
  const lineId = '101f800c-39ed-4d85-8ece-187cd9fe1c5e';

  const routesResponseMock: ReadonlyArray<RouteTableRowFragment> = [
    {
      __typename: 'route_route',
      ...buildRoute({ label: '1' }),
      unique_label: '1',
      route_id: route1Id,
      on_line_id: lineId,
      priority: Priority.Standard,
      direction: RouteDirectionEnum.Outbound,
      route_journey_patterns: [],
    },
  ];

  test('Renders the table with route data (routes and lines)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const routes = routesResponseMock!;
    const { asFragment } = render(
      <RoutesTable testId={testId}>
        {routes.map((item: RouteTableRowFragment) => (
          <RouteTableRow
            rowVariant={RouteLineTableRowVariant.RoutesAndLines}
            key={item.route_id}
            route={item}
          />
        ))}
      </RoutesTable>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test('Renders the table with route data (timetables)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const routes = routesResponseMock!;
    const { asFragment } = render(
      <RoutesTable testId={testId}>
        {routes.map((item: RouteTableRowFragment) => (
          <RouteTableRow
            rowVariant={RouteLineTableRowVariant.Timetables}
            key={item.route_id}
            route={item}
          />
        ))}
      </RoutesTable>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  const linesResponseMock: ReadonlyArray<LineTableRowFragment> = [
    {
      line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
      label: '65',
      priority: Priority.Standard,
      name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
      short_name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
      line_routes: [],
      __typename: 'route_line',
    },
    {
      line_id: '9058c328-efdd-412c-9b2b-37b0f6a2c6fb',
      label: '71',
      priority: Priority.Standard,
      name_i18n: buildLocalizedString('Rautatientori - Malmi as.'),
      short_name_i18n: buildLocalizedString('Rautatientori - Malmi as.'),
      line_routes: [],
      __typename: 'route_line',
    },
    {
      line_id: 'bbd1cb29-74c3-4fa1-ac86-918d7fa96fe2',
      label: '785K',
      priority: Priority.Standard,
      name_i18n: buildLocalizedString('Rautatientori - Nikkilä'),
      short_name_i18n: buildLocalizedString('Rautatientori - Nikkilä'),
      line_routes: [],
      __typename: 'route_line',
    },
    {
      line_id: 'db748c5c-42e3-429f-baa0-e0db227dc2c8',
      label: '1234',
      priority: Priority.Standard,
      name_i18n: buildLocalizedString('Erottaja - Arkkadiankatu'),
      short_name_i18n: buildLocalizedString('Erottaja - Arkkadiankatu'),
      line_routes: [],
      __typename: 'route_line',
    },
  ];

  test('Renders the table with line data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lines = linesResponseMock!;
    const { asFragment } = render(
      <RoutesTable testId={testId}>
        {lines.map((item: LineTableRowFragment) => (
          <LineTableRow
            rowVariant={RouteLineTableRowVariant.RoutesAndLines}
            key={item.line_id}
            line={item}
          />
        ))}
      </RoutesTable>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
