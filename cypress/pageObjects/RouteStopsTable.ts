import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { DirectionBadge } from './DirectionBadge';
import { ExpandableRouteRow } from './ExpandableRouteRow';
import { RouteStopsRow } from './RouteStopsRow';
import { TimingSettingsForm } from './TimingSettingsForm';
import { ViaForm } from './ViaForm';

export class RouteStopsTable {
  viaForm = new ViaForm();

  timingSettingsForm = new TimingSettingsForm();

  expandableRouteRow = new ExpandableRouteRow();

  routeStopsRow = new RouteStopsRow();

  directionBadge = new DirectionBadge();

  getShowUnusedStopsSwitch() {
    return cy.getByTestId('RouteStopsTable::showUnusedStopsSwitch');
  }

  toggleShowUnusedStops() {
    return this.getShowUnusedStopsSwitch().click();
  }

  assertRouteDirection(routeLabel: string, routeDirection: RouteDirectionEnum) {
    if (routeDirection === RouteDirectionEnum.Inbound) {
      return this.expandableRouteRow
        .getRouteHeaderRow(routeLabel)
        .within(() => {
          this.directionBadge.getInboundDirectionBadge();
        });
    }
    if (routeDirection === RouteDirectionEnum.Outbound) {
      return this.expandableRouteRow
        .getRouteHeaderRow(routeLabel)
        .within(() => {
          this.directionBadge.getOutboundDirectionBadge();
        });
    }
    throw new Error('Could not decipher route direction!');
  }
}
