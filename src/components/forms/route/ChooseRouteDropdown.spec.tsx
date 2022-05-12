import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import {
  GetRouteDetailsByLabelWildcardDocument,
  GetRouteDetailsByLabelWildcardQuery,
  RouteDirectionEnum,
} from '../../../generated/graphql';
import { Priority } from '../../../types/Priority';
import {
  buildLocalizedString,
  buildRoute,
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
  const buttonTestId = `${testId}-button`;
  const inputTestId = `${testId}-input`;

  const mocks: MockedResponse<GetRouteDetailsByLabelWildcardQuery>[] = [
    {
      request: {
        query: GetRouteDetailsByLabelWildcardDocument,
        variables: {
          label: '%',
          date: '2022-03-23T00:00:00.000+02:00',
          priorities: [10],
        },
      },
      result: {
        data: {
          route_route: [
            {
              ...buildRoute('1'),
              description_i18n: buildLocalizedString('Route 1'),
              label: '123',
              __typename: 'route_route',
              route_id: 'route1',
              validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-03-29T20:59:59.999+00:00'),
              priority: 10,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              starts_from_scheduled_stop_point_id: 'start',
              ends_at_scheduled_stop_point_id: 'end',
              on_line_id: 'line_id',
            },
            {
              ...buildRoute('2'),
              description_i18n: buildLocalizedString('Route 2'),
              label: '456',
              __typename: 'route_route',
              route_id: 'route2',
              validity_start: DateTime.fromISO('2021-01-01T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-12-31T21:59:59.999+00:00'),
              priority: 10,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              starts_from_scheduled_stop_point_id: 'start',
              ends_at_scheduled_stop_point_id: 'end',
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
          label: '1%',
          date: '2022-03-23T00:00:00.000+02:00',
          priorities: [10],
        },
      },
      result: {
        data: {
          route_route: [
            {
              ...buildRoute('1'),
              description_i18n: buildLocalizedString('Route 1'),
              label: '123',
              __typename: 'route_route',
              route_id: 'route1',
              validity_start: DateTime.fromISO('2022-03-20T22:00:00+00:00'),
              validity_end: DateTime.fromISO('2022-03-29T20:59:59.999+00:00'),
              priority: 10,
              direction: RouteDirectionEnum.Outbound,
              route_shape: null,
              starts_from_scheduled_stop_point_id: 'start',
              ends_at_scheduled_stop_point_id: 'end',
              on_line_id: 'line_id',
            },
          ],
        },
      },
    },
  ];

  test('Opens dropdown when clicked and shows all routes', async () => {
    const { container, asFragment } = render(
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
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and 'Choose route' text still shows in button
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(buttonTestId);
    fireEvent.click(openDropdownButton);

    // dropdown is open, both lines show
    const items = container.querySelectorAll('li');

    expect(items[0].querySelectorAll('div > div')[0].textContent).toBe(
      `123 | route 1`,
    );
    expect(items[0].querySelectorAll('div > div')[1].textContent).toBe(
      `21.3.2022 - 29.3.2022`,
    );
    expect(items[1].querySelectorAll('div > div')[0].textContent).toBe(
      `456 | route 2`,
    );
    expect(items[1].querySelectorAll('div > div')[1].textContent).toBe(
      `2.1.2021 - 31.12.2022`,
    );
    expect(items.length).toBe(2);

    expect(asFragment()).toMatchSnapshot();
  });

  test('Filters shown routes when query is set', async () => {
    const { container, asFragment } = render(
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
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and 'Choose route' text still shows in button
    expect(screen.getByTestId(buttonTestId)).toHaveTextContent(
      'Valitse reitti',
    );
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // write query
    const input = screen.getByTestId(inputTestId);
    fireEvent.change(input, { target: { value: '1' } });

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is open, first line shows
    const items = container.querySelectorAll('li');

    expect(items[0].querySelectorAll('div > div')[0].textContent).toBe(
      `123 | route 1`,
    );
    expect(items[0].querySelectorAll('div > div')[1].textContent).toBe(
      `21.3.2022 - 29.3.2022`,
    );
    expect(items.length).toBe(1);

    expect(asFragment()).toMatchSnapshot();
  });
});
