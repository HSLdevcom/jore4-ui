import { ExpandableRouteRow } from './ExpandableRouteRow';
import { RouteStopsRow } from './RouteStopsRow';
import { TimingSettingsForm } from './TimingSettingsForm';
import { ViaForm } from './ViaForm';

export class RouteStopsTable {
  viaForm = new ViaForm();

  timingSettingsForm = new TimingSettingsForm();

  expandableRouteRow = new ExpandableRouteRow();

  routeStopsRow = new RouteStopsRow();

  getShowUnusedStopsSwitch() {
    return cy.getByTestId('RouteStopsTable::showUnusedStopsSwitch');
  }

  toggleShowUnusedStops() {
    return this.getShowUnusedStopsSwitch().click();
  }

  getRouteDirection(routeLabel: string) {
    return this.expandableRouteRow
      .getRouteHeaderRow(routeLabel)
      .findByTestId('DirectionBadge::value');
  }

  // TODO: check later if RouteDirectionEnum could be used instead of the numbers 1 and 2
  routeDirectionShouldBeOutbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '1');
  }

  routeDirectionShouldBeInbound(routeLabel: string) {
    this.getRouteDirection(routeLabel).should('contain', '2');
  }
}
