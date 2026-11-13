import { ActiveTimeAndPriorityFilters, FilterType } from '../../../redux';
import { Priority } from '../../../types/enums';
import { buildActiveDateGqlFilter } from '../../../utils';
import { buildRouteGqlFilters } from './useRouteGqlFilters';

const observationDate = Temporal.PlainDate.from('2024-05-01');

function buildFilters(
  overrides: Partial<ActiveTimeAndPriorityFilters> = {},
): ActiveTimeAndPriorityFilters {
  return {
    [FilterType.ShowHighestPriorityCurrent]: true,
    [FilterType.ShowCurrent]: true,
    [FilterType.ShowFuture]: false,
    [FilterType.ShowPast]: false,
    [FilterType.ShowStandard]: true,
    [FilterType.ShowTemporary]: true,
    [FilterType.ShowDraft]: false,
    [FilterType.ShowAllBusStops]: false,
    [FilterType.ShowAllTramStops]: false,
    ...overrides,
  };
}

describe('buildRouteGqlFilters', () => {
  it('narrows down to current standard and temporary routes in highest priority mode', () => {
    const { routeFilters, showHighestPriorityCurrent } = buildRouteGqlFilters(
      buildFilters(),
      observationDate,
    );

    expect(showHighestPriorityCurrent).toBe(true);
    expect(routeFilters).toEqual({
      ...buildActiveDateGqlFilter(observationDate),
      priority: { _in: [Priority.Standard, Priority.Temporary] },
    });
  });

  it('combines the active time filters and priorities', () => {
    const { routeFilters, showHighestPriorityCurrent } = buildRouteGqlFilters(
      buildFilters({
        [FilterType.ShowHighestPriorityCurrent]: false,
        [FilterType.ShowPast]: true,
        [FilterType.ShowDraft]: true,
      }),
      observationDate,
    );

    expect(showHighestPriorityCurrent).toBe(false);
    expect(routeFilters).toEqual({
      _or: [
        buildActiveDateGqlFilter(observationDate),
        { validity_end: { _lt: observationDate } },
      ],
      priority: {
        _in: [Priority.Standard, Priority.Temporary, Priority.Draft],
      },
    });
  });

  it('matches nothing when no time filter is active', () => {
    const { routeFilters } = buildRouteGqlFilters(
      buildFilters({
        [FilterType.ShowHighestPriorityCurrent]: false,
        [FilterType.ShowCurrent]: false,
      }),
      observationDate,
    );

    expect(routeFilters).toEqual({
      route_id: { _is_null: true },
      priority: { _in: [Priority.Standard, Priority.Temporary] },
    });
  });

  it('only matches draft routes in draft mode', () => {
    const { routeFilters } = buildRouteGqlFilters(
      buildFilters({
        [FilterType.ShowHighestPriorityCurrent]: false,
        [FilterType.ShowStandard]: false,
        [FilterType.ShowTemporary]: false,
        [FilterType.ShowDraft]: true,
      }),
      observationDate,
    );

    expect(routeFilters).toEqual({
      _or: [buildActiveDateGqlFilter(observationDate)],
      priority: { _in: [Priority.Draft] },
    });
  });
});
