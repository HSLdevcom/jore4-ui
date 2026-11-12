// MapEntityType + FilterType
export enum KnownMapItemTypeFilters {
  Stop = 'show-stops',
  StopArea = 'show-stop-areas',
  StopLabel = 'show-stop-labels',
  Terminal = 'show-terminals',
  InfoScreen = 'show-info-screens',
  InfoSpot = 'show-info-spots',

  ShowFuture = 'show-future',
  ShowCurrent = 'show-current',
  ShowPast = 'show-past',
  ShowStandard = 'show-standard',
  ShowTemporary = 'show-temporary',
  ShowDraft = 'show-draft',
  ShowHighestPriorityCurrent = 'show-highest-priority-current',
  ShowAllBusStops = 'show-all-bus-stops',
}

type SetFilters = { readonly [key in KnownMapItemTypeFilters]?: boolean };

export class MapItemTypeFiltersOverlay {
  static setFilters(setFilters: SetFilters) {
    Object.entries(setFilters)
      // Handle ShowHighestPriorityCurrent 1st, as it controls whether
      // some of the other options are enabled.
      .sort(([typeA], [typeB]) => {
        if (typeA === KnownMapItemTypeFilters.ShowHighestPriorityCurrent) {
          return -1;
        }

        if (typeB === KnownMapItemTypeFilters.ShowHighestPriorityCurrent) {
          return 1;
        }

        return 0;
      })
      .forEach(([type, shouldBeChecked]) => {
        if (shouldBeChecked) {
          cy.get(`#filter-${type}`).should('not.be.disabled').check();
        } else {
          cy.get(`#filter-${type}`).should('not.be.disabled').uncheck();
        }
      });
  }
}
