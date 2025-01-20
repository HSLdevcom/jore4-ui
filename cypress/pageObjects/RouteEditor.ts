import '@4tw/cypress-drag-drop';
import { expectGraphQLCallToSucceed } from '../utils/assertions';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { Toast } from './Toast';

export interface MoveRouteEditHandleInfo extends MoveOptions {
  handleIndex: number;
  // Not sure why this is not included in MoveOptions, but it seems to be there.
  // This can be used if e.g. some stop is covering part of the handle, we can click
  // some other corner.
  position?: Cypress.PositionType;
}

export class RouteEditor {
  map = new Map();

  mapFooter = new MapFooter();

  toast = new Toast();

  gqlRouteShouldBeCreatedSuccessfully() {
    return expectGraphQLCallToSucceed('@gqlInsertRouteOne');
  }

  checkRouteSubmitSuccessToast() {
    this.toast.expectSuccessToast('Reitti tallennettu');
  }
}
