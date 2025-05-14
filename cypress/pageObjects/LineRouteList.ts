import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { LineRouteListItem } from './routes-and-lines';

export class LineRouteList {
  lineRouteListItem = new LineRouteListItem();

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
      return this.lineRouteListItem.routeRow
        .getRouteHeaderRow(routeLabel, routeDirection)
        .within(() => {
          this.lineRouteListItem.routeRow.directionBadge.getInboundDirectionBadge();
        });
    }
    if (routeDirection === RouteDirectionEnum.Outbound) {
      return this.lineRouteListItem.routeRow
        .getRouteHeaderRow(routeLabel, routeDirection)
        .within(() => {
          this.lineRouteListItem.routeRow.directionBadge.getOutboundDirectionBadge();
        });
    }
    throw new Error('Could not decipher route direction!');
  }
}
