import { MockedProvider } from '@apollo/client/testing';
import { act, fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import React from 'react';
import {
  ListAllLinesDocument,
  useListAllLinesQuery,
} from '../../generated/graphql';
import { render, sleep } from '../../utils/test-utils';
import { ChooseLineDropdown } from './ChooseLineDropdown';

describe('<ChooseLineDropdown />', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onBlur = () => {};
  const value = 'line1';
  const testId = 'chooseLineDropdown1';

  const mocks = [
    {
      request: {
        query: ListAllLinesDocument,
        variables: {},
      },
      result: {
        data: {
          route_line: [
            {
              __typename: 'route_line',
              line_id: 'line1',
              label: '1',
              name_i18n: 'Line1 name',
              short_name_i18n: 'Line1',
              validity_start: DateTime.fromISO('2017-02-13T12:51:48.000Z'),
              validity_end: null,
            },
            {
              __typename: 'route_line',
              line_id: 'line2',
              label: '2',
              name_i18n: 'Line2 name',
              short_name_i18n: 'Line2',
              validity_start: DateTime.fromISO('2017-02-13T12:51:48.000Z'),
              validity_end: null,
            },
          ],
        },
      } as ReturnType<typeof useListAllLinesQuery>,
    },
  ];

  test('Opens dropdown when clicked and shows all lines', async () => {
    const { container, asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChooseLineDropdown
          testId={testId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </MockedProvider>,
    );

    // dropdown is collapsed, value is not yet bound to dropdown, 'Choose line' text shows
    expect(screen.getByTestId(testId)).toHaveTextContent('routes.chooseLine');
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and the pre-selected line1 is shown on the button
    expect(screen.getByTestId(testId)).toHaveTextContent('1 (Line1 name)');
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(testId);
    fireEvent.click(openDropdownButton);

    // dropdown is open, both lines show
    expect(screen.queryByText('routes.chooseLine')).toBeNull();
    const items = container.querySelectorAll('li');
    expect(items[0].textContent).toBe('1 (Line1 name)');
    expect(items[1].textContent).toBe('2 (Line2 name)');
    expect(asFragment()).toMatchSnapshot();
  });
});
