import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { act, fireEvent, screen } from '@testing-library/react';
import { DateTime } from 'luxon';
import {
  GetLinesForComboboxDocument,
  GetSelectedLineDetailsByIdDocument,
} from '../../../generated/graphql';
import { buildLocalizedString, render, sleep } from '../../../utils/test-utils';
import { ChooseLineDropdown } from './ChooseLineDropdown';

describe('<ChooseLineDropdown />', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onChange = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onBlur = () => {};
  const value = 'line1';
  const testId = 'ChooseLineDropdown1';
  const buttonTestId = `${testId}::button`;

  const mocks: MockedResponse[] = [
    {
      request: {
        query: GetLinesForComboboxDocument,
        variables: { labelPattern: '%', date: DateTime.now().toISO() },
      },
      result: {
        data: {
          route_line: [
            {
              __typename: 'route_line',
              line_id: 'line1',
              label: '1',
              name_i18n: buildLocalizedString('Line1 name'),
              validity_start: DateTime.fromISO('2017-02-13T12:51:48.000Z'),
              validity_end: null,
            },
            {
              __typename: 'route_line',
              line_id: 'line2',
              label: '2',
              name_i18n: buildLocalizedString('Line2 name'),
              validity_start: DateTime.fromISO('2017-02-13T12:51:48.000Z'),
              validity_end: null,
            },
          ],
        },
      },
    },
    {
      request: {
        query: GetSelectedLineDetailsByIdDocument,
        variables: { line_id: 'line1' },
      },
      result: {
        data: {
          route_line_by_pk: {
            __typename: 'route_line',
            line_id: 'line1',
            label: '1',
            name_i18n: buildLocalizedString('Line1 name'),
            validity_start: DateTime.fromISO('2017-02-13T12:51:48.000Z'),
            validity_end: null,
          },
        },
      },
    },
  ];

  test('Shows correct texts when loading with preselected line', async () => {
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
    expect(screen.getByTestId(testId)).toHaveTextContent('Valitse linja');
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and the pre-selected line1 is shown on the button
    expect(screen.getByTestId(testId)).toHaveTextContent('1 (Line1 name)');

    expect(asFragment()).toMatchSnapshot();
  });

  test('Shows correct texts when loading without pre-selected line', async () => {
    const { container, asFragment } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChooseLineDropdown
          testId={testId}
          value={undefined}
          onChange={onChange}
          onBlur={onBlur}
        />
      </MockedProvider>,
    );

    // dropdown is collapsed, value is not yet bound to dropdown, 'Choose line' text shows
    expect(screen.getByTestId(testId)).toHaveTextContent('Valitse linja');
    expect(container.querySelector('li')).toBeNull();
    expect(asFragment()).toMatchSnapshot();

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // dropdown is collapsed, data is loaded and there is no pre-selected line
    expect(screen.getByTestId(testId)).toHaveTextContent('Valitse linja');

    expect(asFragment()).toMatchSnapshot();
  });

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

    // wait for the graphql call to execute
    await act(() => sleep(0));

    // click dropdown to open it:
    const openDropdownButton = screen.getByTestId(buttonTestId);
    fireEvent.click(openDropdownButton);

    // dropdown is open, both lines show
    expect(screen.queryByText('Valitse linja')).toBeNull();

    const items = container.querySelectorAll('li');

    expect(items.length).toBe(2);
    expect(items[0].textContent).toBe('1 (Line1 name)13.2.2017 - 31.12.2050');
    expect(items[1].textContent).toBe('2 (Line2 name)13.2.2017 - 31.12.2050');

    expect(asFragment()).toMatchSnapshot();
  });
});
