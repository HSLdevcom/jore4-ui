import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useListChangingRoutesQuery } from '../generated/graphql';
import { mapListChangingRoutesResult } from '../graphql/route';
import { render } from '../utils/test-utils';
import { RoutesTable } from './RoutesTable';

describe(`<${RoutesTable.name} />`, () => {
  const testId = 'routesTable1';
  const route1Id = '03d55414-e5cf-4cce-9faf-d86ccb7e5f98';
  const lineId = '101f800c-39ed-4d85-8ece-187cd9fe1c5e';
  const stop1Id = 'f8eace87-7901-4438-bfee-bb6f24f1c4c4';
  const stop2Id = 'e3528755-711f-4e4f-9461-7931a2c4bc6d';

  // this response is copy-pasted from the actual graphql response
  const mockResponse = {
    data: {
      route_route: [
        {
          route_id: route1Id,
          description_i18n: null,
          on_line_id: lineId,
          __typename: 'route_route',
          route_line: {
            line_id: lineId,
            label: '65',
            name_i18n: 'Rautatientori - Kätilöopisto - Veräjälaakso',
            short_name_i18n: 'Rautatientori - Veräjälaakso',
            description_i18n: 'Rautatientori - Kätilöopisto - Veräjälaakso',
            __typename: 'route_line',
          },
          starts_from_scheduled_stop_point: {
            scheduled_stop_point_id: stop1Id,
            label: 'pysäkki B',
            __typename: 'service_pattern_scheduled_stop_point',
          },
          ends_at_scheduled_stop_point: {
            scheduled_stop_point_id: stop2Id,
            label: 'pysäkki A',
            __typename: 'service_pattern_scheduled_stop_point',
          },
        },
      ],
    },
  } as ReturnType<typeof useListChangingRoutesQuery>;

  test('Renders the routes table based on data', async () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const routes = mapListChangingRoutesResult(mockResponse)!;
    const { asFragment } = render(
      <BrowserRouter>
        <RoutesTable testId={testId} routes={routes} />
      </BrowserRouter>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
