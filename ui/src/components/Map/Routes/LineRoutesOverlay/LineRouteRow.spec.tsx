import { screen } from '@testing-library/react';
import { act } from 'react';
import {
  DisplayedRouteFragment,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
} from '../../../../generated/graphql';
import {
  resetMapRouteEditorStateAction,
  selectSelectedRouteId,
  selectVisibleRouteIds,
  store,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import {
  fireFullMouseClickSequence,
  render,
} from '../../../../utils/test-utils';
import { LineRouteRow, lineRouteRowTestIds } from './LineRouteRow';

// The stop list of an opened row is covered by e2e tests. Without Apollo mocks
// it would only log "no mocked response" errors here.
jest.mock('./LineRouteStops', () => ({ LineRouteStops: () => null }));

const routeId = '2f0a4e5a-1d7a-4f7e-bf1e-6a0a5e1d7a4f';

const rowTestId = lineRouteRowTestIds.row('901', RouteDirectionEnum.Outbound);

function buildRoute(
  overrides: Partial<DisplayedRouteFragment> = {},
): DisplayedRouteFragment {
  return {
    __typename: 'route_route',
    route_id: routeId,
    label: '901',
    variant: null,
    name_i18n: { fi_FI: 'Reitti A - B' },
    validity_start: Temporal.PlainDate.from('2010-01-01'),
    validity_end: null,
    priority: Priority.Standard,
    direction: RouteDirectionEnum.Outbound,
    route_line: {
      line_id: 'a63a4b4a-2c38-4a0a-9e2f-0e1a0b7c4d55',
      label: '901',
      name_i18n: { fi_FI: 'Linja A - B' },
      primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
      type_of_line: RouteTypeOfLineEnum.StoppingBusService,
    },
    route_journey_patterns: [],
    ...overrides,
  } as unknown as DisplayedRouteFragment;
}

describe(`<${LineRouteRow.name} />`, () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(resetMapRouteEditorStateAction());
    });
  });

  it('toggles the route visibility on the map', () => {
    render(<LineRouteRow route={buildRoute()} isVisible={false} />);

    const visibilitySwitch = screen.getByRole('switch', { name: /901/ });
    expect(visibilitySwitch).toHaveAttribute('aria-checked', 'false');

    act(() => {
      fireFullMouseClickSequence(visibilitySwitch);
    });

    expect(selectVisibleRouteIds(store.getState())).toEqual([routeId]);
  });

  it('opens and closes the row without changing the visibility', () => {
    render(<LineRouteRow route={buildRoute()} isVisible={false} />);

    const row = screen.getByRole('button', { name: /Reitti A - B/ });
    expect(row).toHaveAttribute('aria-expanded', 'false');

    act(() => {
      fireFullMouseClickSequence(row);
    });

    expect(selectSelectedRouteId(store.getState())).toBe(routeId);
    expect(row).toHaveAttribute('aria-expanded', 'true');
    expect(selectVisibleRouteIds(store.getState())).toEqual([]);

    act(() => {
      fireFullMouseClickSequence(row);
    });

    expect(selectSelectedRouteId(store.getState())).toBeUndefined();
    expect(selectVisibleRouteIds(store.getState())).toEqual([]);
  });

  it('grays out a route that is not valid on the observation date', () => {
    render(
      <LineRouteRow
        route={buildRoute({
          validity_start: Temporal.PlainDate.from('2010-01-01'),
          validity_end: Temporal.PlainDate.from('2012-12-31'),
        })}
        isVisible={false}
      />,
    );

    expect(screen.getByTestId(rowTestId)).toHaveClass('bg-background');
    expect(screen.getByText('Reitti A - B')).toHaveClass('text-grey');
  });

  it('highlights a route that is valid on the observation date', () => {
    render(<LineRouteRow route={buildRoute()} isVisible={false} />);

    expect(screen.getByTestId(rowTestId)).toHaveClass('bg-white');
    expect(screen.getByText('Reitti A - B')).toHaveClass('text-black');
  });
});
