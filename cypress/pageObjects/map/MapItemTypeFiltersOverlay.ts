// MapEntityType + FilterType
export enum KnownMapItemTypeFilters {
  Stop = 'show-stops',
  StopArea = 'show-stop-areas',
  Terminal = 'show-terminals',
  InfoScreen = 'show-info-screens',
  InfoSpot = 'show-info-spots',

  ShowFutureStops = 'show-future-stops',
  ShowCurrentStops = 'show-current-stops',
  ShowPastStops = 'show-past-stops',
  ShowStandardStops = 'show-standard-stops',
  ShowTemporaryStops = 'show-temporary-stops',
  ShowDraftStops = 'show-draft-stops',
  ShowHighestPriorityCurrentStops = 'show-highest-priority-current-stops',
  ShowAllBusStops = 'show-all-bus-stops',
}

type SetFilters = { readonly [key in KnownMapItemTypeFilters]?: boolean };

export class MapItemTypeFiltersOverlay {
  static setFilters(setFilters: SetFilters) {
    Object.entries(setFilters)
      // Handle ShowHighestPriorityCurrentStops 1st, as it controls whether
      // some of the other options are enabled.
      .sort(([typeA], [typeB]) => {
        if (typeA === KnownMapItemTypeFilters.ShowHighestPriorityCurrentStops) {
          return -1;
        }

        if (typeB === KnownMapItemTypeFilters.ShowHighestPriorityCurrentStops) {
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
