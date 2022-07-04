import React from 'react';
import {
  ListChangingRoutesQuery,
  RouteDirectionEnum,
  RouteLine,
  RouteRoute,
  useListOwnLinesQuery,
} from '../../../generated/graphql';
import {
  GqlQueryResult,
  mapListOwnLinesResult,
  mapRouteResultToRoutes,
} from '../../../graphql';
import {
  buildLocalizedString,
  buildRoute,
  render,
} from '../../../utils/test-utils';
import { LineTableRow } from './LineTableRow';
import { RoutesTable } from './RoutesTable';
import { RoutesTableRow } from './RoutesTableRow';

describe(`<${RoutesTable.name} />`, () => {
  const testId = 'routesTable1';
  const route1Id = '03d55414-e5cf-4cce-9faf-d86ccb7e5f98';
  const lineId = '101f800c-39ed-4d85-8ece-187cd9fe1c5e';

  // this response is copy-pasted from the actual graphql response
  const routesResponseMock: GqlQueryResult<ListChangingRoutesQuery> = {
    data: {
      route_route: [
        {
          __typename: 'route_route',
          ...buildRoute('1'),
          route_id: route1Id,
          on_line_id: lineId,
          priority: 10,
          direction: RouteDirectionEnum.Outbound,
          route_line: {
            line_id: lineId,
            label: '65',
            name_i18n: buildLocalizedString(
              'Rautatientori - Kätilöopisto - Veräjälaakso',
            ),
            short_name_i18n: buildLocalizedString(
              'Rautatientori - Veräjälaakso',
            ),
            __typename: 'route_line',
          },
        },
      ],
    },
  };

  test('Renders the table with route data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const routes = mapRouteResultToRoutes(routesResponseMock)!;
    const { asFragment } = render(
      <RoutesTable testId={testId}>
        {routes.map((item: RouteRoute) => (
          <RoutesTableRow key={item.route_id} route={item} />
        ))}
      </RoutesTable>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // this response is copy-pasted from the actual graphql response
  const linesResponseMock = {
    data: {
      route_line: [
        {
          line_id: '101f800c-39ed-4d85-8ece-187cd9fe1c5e',
          label: '65',
          name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
          short_name_i18n: buildLocalizedString('Rautatientori - Veräjälaakso'),
          __typename: 'route_line',
        },
        {
          line_id: '9058c328-efdd-412c-9b2b-37b0f6a2c6fb',
          label: '71',
          name_i18n: buildLocalizedString('Rautatientori - Malmi as.'),
          short_name_i18n: buildLocalizedString('Rautatientori - Malmi as.'),
          __typename: 'route_line',
        },
        {
          line_id: 'bbd1cb29-74c3-4fa1-ac86-918d7fa96fe2',
          label: '785K',
          name_i18n: buildLocalizedString('Rautatientori - Nikkilä'),
          short_name_i18n: buildLocalizedString('Rautatientori - Nikkilä'),
          __typename: 'route_line',
        },
        {
          line_id: 'db748c5c-42e3-429f-baa0-e0db227dc2c8',
          label: '1234',
          name_i18n: buildLocalizedString('Erottaja - Arkkadiankatu'),
          short_name_i18n: buildLocalizedString('Erottaja - Arkkadiankatu'),
          __typename: 'route_line',
        },
      ],
    },
  } as ReturnType<typeof useListOwnLinesQuery>;

  test('Renders the table with line data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lines = mapListOwnLinesResult(linesResponseMock)!;
    const { asFragment } = render(
      <RoutesTable testId={testId}>
        {lines.map((item: RouteLine) => (
          <LineTableRow key={item.line_id} line={item} />
        ))}
      </RoutesTable>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
