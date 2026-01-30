import '@4tw/cypress-drag-drop';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { Toast } from '../shared-components/Toast';
import { Map } from './Map';
import { MapFooter } from './MapFooter';

export interface MoveRouteEditHandleInfo extends MoveOptions {
  handleIndex: number;
  // Not sure why this is not included in MoveOptions, but it seems to be there.
  // This can be used if e.g. some stop is covering part of the handle, we can click
  // some other corner.
  position?: Cypress.PositionType;
}

export class RouteEditor {
  static map = Map;

  static mapFooter = MapFooter;

  static gqlRouteShouldBeCreatedSuccessfully() {
    return expectGraphQLCallToSucceed('@gqlInsertRouteOne');
  }

  static checkRouteSubmitSuccessToast() {
    Toast.expectSuccessToast('Reitti tallennettu');
  }
}
