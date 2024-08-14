import { RouteRow } from '../../RouteRow';
import { RouteStopListItem } from '../../RouteStopListItem';

export class LineRouteListItem {
  routeRow = new RouteRow();

  routeStopListItem = new RouteStopListItem();

  getRouteStopListItems() {
    return cy.getByTestId('RouteStopListItem::container');
  }

  getNthRouteStopListItem(nth: number) {
    return this.getRouteStopListItems().eq(nth);
  }
}
