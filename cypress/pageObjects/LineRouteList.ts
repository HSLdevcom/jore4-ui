import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import { DirectionBadge } from './DirectionBadge';
import { RouteRow } from './RouteRow';
import { LineRouteListItem } from './routes-and-lines';
import { RouteStopListItem } from './RouteStopListItem';

export class LineRouteList {
  lineRouteListItem = new LineRouteListItem();

  routeRow = new RouteRow();

  routeStopListItem = new RouteStopListItem();

  directionBadge = new DirectionBadge();

  getLineRouteListItems() {
    return cy.getByTestId('LineRouteListItem');
  }

  getNthLineRouteListItem(nth: number) {
    return this.getLineRouteListItems().eq(nth);
  }

  getShowUnusedStopsSwitch() {
    return cy.getByTestId('LineRouteList::showUnusedStopsSwitch');
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
