import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { buildRoute } from '@hsl/jore4-test-db-manager';
import { act, fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import {
  GetRouteDetailsByLabelWildcardDocument,
  GetRouteDetailsByLabelWildcardQuery,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import {
  fireFullMouseClickSequence,
  render,
  sleep,
} from '../../../utils/test-utils';
import { ChooseRouteDropdown } from './ChooseRouteDropdown';

describe(`<${ChooseRouteDropdown.name} />`, () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onBlur = () => {};
  const value = '';
  const testId = 'ChooseRouteDropdown1';
  const buttonTestId = `${testId}::button`;
  const inputTestId = `${testId}::input`;

  const mocks: ReadonlyArray<
    MockedResponse<GetRouteDetailsByLabelWildcardQuery>
  > = [
    {
      request: {
        query: GetRouteDetailsByLabelWildcardDocument,
        variables: {
          labelPattern: '%',
          date: '2022-03-23T00:00:00.000+02:00',
          priorities: [10],
        },
      },
      result: {
        data: {
          route_route: [
            {
              ...buildRoute({ label: '123' }),
              __typename: 'route_route',
              route_id: 'route1',
              validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-03-29T20:59:59.999+00:00'),
              priority: Priority.Standard,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              on_line_id: 'line_id',
            },
            {
              ...buildRoute({ label: '456' }),
              __typename: 'route_route',
              route_id: 'route2',
              validity_start: DateTime.fromISO('2021-01-01T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-12-31T21:59:59.999+00:00'),
              priority: Priority.Standard,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              on_line_id: 'line_id',
            },
          ],
        },
      },
    },
    {
      request: {
        query: GetRouteDetailsByLabelWildcardDocument,
        variables: {
          labelPattern: '1%',
          date: '2022-03-23T00:00:00.000+02:00',
          priorities: [10],
        },
      },
      result: {
        data: {
          route_route: [
            {
              ...buildRoute({ label: '123' }),
              label: '123',
              __typename: 'route_route',
              route_id: 'route1',
              validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-03-29T20:59:59.999+00:00'),
              priority: Priority.Standard,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              on_line_id: 'line_id',
            },
          ],
        },
      },
    },
  ];

  test('Opens dropdown when clicked and shows all routes', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChooseRouteDropdown
          testId={testId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          date={DateTime.fromISO('2022-03-23T00:00:00.000+02:00')}
          priorities={[Priority.Standard]}
        />
      </MockedProvider>,
    );

    // dropdown is collapsed, value is not yet bound to dropdown, 'Choose route' text shows
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and 'Choose route' text still shows in button
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(asFragment()).toMatchSnapshot();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(buttonTestId);
    fireFullMouseClickSequence(openDropdownButton);

    // dropdown is open, both lines show
    const items = screen.queryAllByRole('option');

    expect(
      items[0].querySelector('[data-testid="label-and-name"]')?.textContent,
    ).toBe(`123 | route 123`);
    expect(items[0].querySelector('.text-sm')?.textContent).toBe(
      `21.3.2022 - 29.3.2022`,
    );
    expect(
      items[1].querySelector('[data-testid="label-and-name"]')?.textContent,
    ).toBe(`456 | route 456`);
    expect(items[1].querySelector('.text-sm')?.textContent).toBe(
      `2.1.2021 - 31.12.2022`,
    );
    expect(items.length).toBe(2);

    expect(asFragment()).toMatchSnapshot();
  });

  test('Filters shown routes when query is set', async () => {
    const { asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChooseRouteDropdown
          testId={testId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          date={DateTime.fromISO('2022-03-23T00:00:00.000+02:00')}
          priorities={[Priority.Standard]}
        />
      </MockedProvider>,
    );

    // dropdown is collapsed, value is not yet bound to dropdown, 'Choose route' text shows
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and 'Choose route' text still shows in button
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(screen.queryAllByRole('option')).toHaveLength(0);
    expect(asFragment()).toMatchSnapshot();

    // write a query to the input textbox
    const input = screen.getByTestId(inputTestId);
    fireEvent.change(input, { target: { value: '1' } });

    // To make sure that the query result is ready, we need to use real timers again
    await act(async () => sleep(0));
    // dropdown is open, first line shows
    const items = screen.queryAllByRole('option');

    expect(
      items[0].querySelector('[data-testid="label-and-name"]')?.textContent,
    ).toBe(`123 | route 123`);
    expect(items[0].querySelector('.text-sm')?.textContent).toBe(
      `21.3.2022 - 29.3.2022`,
    );
    expect(items.length).toBe(1);

    expect(asFragment()).toMatchSnapshot();
  });
});
