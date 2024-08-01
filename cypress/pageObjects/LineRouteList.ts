import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { DirectionBadge } from './DirectionBadge';
import { RouteRow } from './RouteRow';
import { RouteStopListItem } from './RouteStopListItem';
import { TimingSettingsForm } from './TimingSettingsForm';
import { ViaForm } from './ViaForm';

export class LineRouteList {
  viaForm = new ViaForm();

  timingSettingsForm = new TimingSettingsForm();

  routeRow = new RouteRow();

  routeStopListItem = new RouteStopListItem();

  directionBadge = new DirectionBadge();

  getShowUnusedStopsSwitch() {
    return cy.getByTestId('LineRouteList::showUnusedStopsSwitch');
  }

  toggleShowUnusedStops() {
    return this.getShowUnusedStopsSwitch().click();
  }

  assertRouteDirection(routeLabel: string, routeDirection: RouteDirectionEnum) {
    if (routeDirection === RouteDirectionEnum.Inbound) {
      return this.routeRow
        .getRouteHeaderRow(routeLabel, routeDirection)
        .within(() => {
          this.directionBadge.getInboundDirectionBadge();
        });
    }
    if (routeDirection === RouteDirectionEnum.Outbound) {
      return this.routeRow
        .getRouteHeaderRow(routeLabel, routeDirection)
        .within(() => {
          this.directionBadge.getOutboundDirectionBadge();
        });
    }
    throw new Error('Could not decipher route direction!');
  }
}
