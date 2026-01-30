import { RouteRow } from '../RouteRow';
import { RouteStopListItem } from '../RouteStopListItem';

export class LineRouteListItem {
  static routeRow = RouteRow;

  static routeStopListItem = RouteStopListItem;

  static getRouteStopListItems() {
    return cy.getByTestId('RouteStopListItem::container');
  }

  static getNthRouteStopListItem(nth: number) {
    return LineRouteListItem.getRouteStopListItems().eq(nth);
  }
}
