import { RouteRow } from '../../RouteRow';
import { RouteStopListItem } from '../../RouteStopListItem';

export class LineRouteListItem {
  routeRow = new RouteRow();

  routeStopListItem = new RouteStopListItem();

  getRouteStopListItems() {
    return cy.get('[data-testid^="RouteStopListItem::container"]');
  }

  getNthRouteStopListItem(nth: number) {
    return this.getRouteStopListItems().eq(nth);
  }
}
