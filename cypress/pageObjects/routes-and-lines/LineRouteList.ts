import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { DirectionBadge } from '../shared-components';
import { LineRouteListItem } from './line-details-page';
import { RouteRow } from './RouteRow';

export class LineRouteList {
  static lineRouteListItem = LineRouteListItem;

  static getLineRouteListItems() {
    return cy.getByTestId('LineRouteListItem');
  }

  static getNthLineRouteListItem(nth: number) {
    return LineRouteList.getLineRouteListItems().eq(nth);
  }

  static getShowUnusedStopsSwitch() {
    return cy.getByTestId('LineRouteList::showUnusedStopsSwitch');
  }

  static assertRouteDirection(
    routeLabel: string,
    routeDirection: RouteDirectionEnum,
  ) {
    if (routeDirection === RouteDirectionEnum.Inbound) {
      return RouteRow.getRouteHeaderRow(routeLabel, routeDirection).within(
        () => {
          DirectionBadge.getInboundDirectionBadge();
        },
      );
    }
    if (routeDirection === RouteDirectionEnum.Outbound) {
      return RouteRow.getRouteHeaderRow(routeLabel, routeDirection).within(
        () => {
          DirectionBadge.getOutboundDirectionBadge();
        },
      );
    }
    throw new Error('Could not decipher route direction!');
  }
}
