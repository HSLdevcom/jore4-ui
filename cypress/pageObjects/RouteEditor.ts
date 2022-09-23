import { Toast } from './Toast';

export class RouteEditor {
  toast = new Toast();

  gqlRouteShouldBeCreatedSuccessfully() {
    return cy
      .wait('@gqlInsertRouteOne')
      .its('response.statusCode')
      .should('equal', 200);
  }

  checkRouteSubmitSuccess() {
    this.toast.checkSuccessToastHasMessage('Reitti tallennettu');
  }

  checkRouteSubmitFailure() {
    this.toast.checkDangerToastHasMessage('Tallennus epäonnistui');
  }
}
