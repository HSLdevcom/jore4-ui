import {
  DisplayedRouteFragment,
  RouteDirectionEnum,
} from '../../../../generated/graphql';
import { resolveVisibleRouteIds, sortRoutes } from './useLineRoutes';

function buildRoute(
  routeId: string,
  label: string,
  variant: number | null,
  direction: RouteDirectionEnum,
  validityStart: string | null,
): DisplayedRouteFragment {
  return {
    route_id: routeId,
    label,
    variant,
    direction,
    validity_start: validityStart
      ? Temporal.PlainDate.from(validityStart)
      : null,
  } as unknown as DisplayedRouteFragment;
}

describe('sortRoutes', () => {
  it('sorts by label, variant, direction and validity start', () => {
    const routes = [
      buildRoute('5', '2', 1, RouteDirectionEnum.Outbound, '2023-01-01'),
      buildRoute('4', '1', 2, RouteDirectionEnum.Outbound, '2023-01-01'),
      buildRoute('3', '1', 1, RouteDirectionEnum.Inbound, '2023-01-01'),
      buildRoute('2', '1', 1, RouteDirectionEnum.Outbound, '2024-01-01'),
      buildRoute('1', '1', 1, RouteDirectionEnum.Outbound, '2023-01-01'),
    ];

    expect(sortRoutes(routes).map((route) => route.route_id)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('sorts routes without a validity start last', () => {
    const routes = [
      buildRoute('1', '1', 1, RouteDirectionEnum.Outbound, null),
      buildRoute('2', '1', 1, RouteDirectionEnum.Outbound, '2023-01-01'),
    ];

    expect(sortRoutes(routes).map((route) => route.route_id)).toEqual([
      '2',
      '1',
    ]);
  });
});

describe('resolveVisibleRouteIds', () => {
  const routes = [
    buildRoute('1', '1', null, RouteDirectionEnum.Outbound, '2023-01-01'),
    buildRoute('2', '1', null, RouteDirectionEnum.Inbound, '2023-01-01'),
  ];

  it('drops ids that are no longer on the list', () => {
    expect(resolveVisibleRouteIds(routes, ['2', 'gone'], undefined)).toEqual([
      '2',
    ]);
  });

  it('keeps the visible ids untouched when they are all on the list', () => {
    expect(resolveVisibleRouteIds(routes, ['1', '2'], '1')).toEqual(['1', '2']);
  });

  it('falls back to the selected route when nothing on the list is visible', () => {
    expect(resolveVisibleRouteIds(routes, ['gone'], '2')).toEqual(['2']);
  });

  it('falls back to the first route when the selected route is not on the list', () => {
    expect(resolveVisibleRouteIds(routes, [], 'gone')).toEqual(['1']);
  });

  it('resolves to nothing when there are no routes', () => {
    expect(resolveVisibleRouteIds([], ['gone'], 'gone')).toEqual([]);
  });
});
