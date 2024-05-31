import { EditRouteModal } from './EditRouteModal';
import { ClickPointNearMapMarker, Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteEditor } from './RouteEditor';
import { RouteFormInfo, RoutePropertiesForm } from './RoutePropertiesForm';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopForm, StopFormInfo } from './StopForm';
import { Toast } from './Toast';

export class MapModal {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  stopForm = new StopForm();

  routeStopsOverlay = new RouteStopsOverlay();

  editRouteModal = new EditRouteModal();

  toast = new Toast();

  routeEditor = new RouteEditor();

  /**
   * Creates stop using ClickPointNear stop.
   * This means that you give a stop testId as the origin of the click
   * and then 'right' and 'down' values of where you want to click
   * related to that stop.
   */
  createStopNextToAnotherStop = ({
    stopFormInfo,
    stopPoint,
  }: {
    stopFormInfo: StopFormInfo;
    stopPoint: ClickPointNearMapMarker;
  }) => {
    this.mapFooter.addStop();

    this.map.clickAtPositionFromMapMarkerByTestId(stopPoint);

    this.stopForm.fillForm(stopFormInfo);

    this.stopForm.save();
  };

  /**
   * This creates stop at a location that is specified by percentages of the viewport'sg width and height.
   */
  createStopAtLocation = ({
    stopFormInfo,
    clickRelativePoint,
  }: {
    stopFormInfo: StopFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
  }) => {
    this.mapFooter.addStop();

    this.map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    this.stopForm.fillForm(stopFormInfo);

    this.stopForm.save();
  };

  /**
   * Create route with UI by giving the necessary information for route creation. This
   * uses ClickPointNearStop array for the route points. This means that you give a stop
   * testId as the origin of the click and then 'right' and 'down' values of where you want
   * to click related to that stop.
   */
  createRoute = ({
    routeFormInfo,
    routePoints,
    omittedStops,
  }: {
    routeFormInfo: RouteFormInfo;
    routePoints?: ClickPointNearMapMarker[];
    omittedStops?: string[];
  }) => {
    this.map.waitForLoadToComplete();

    this.mapFooter.createRoute();

    this.routePropertiesForm.fillRouteProperties(routeFormInfo);

    this.editRouteModal.save();

    this.map.getLoader().should('not.exist');

    if (routeFormInfo.templateRoute?.moveRouteEditHandleInfo) {
      this.map.getLoader().should('not.exist');
      this.mapFooter.editRoute();
      this.routeEditor.editOneRoutePoint(
        routeFormInfo.templateRoute.moveRouteEditHandleInfo,
      );
      // Using a route as a template seems to fail without these waits
      cy.wait('@gqlGetLinksWithStopsByExternalLinkIds');
      cy.wait('@gqlGetStopsAlongInfrastructureLinks');
      cy.wait('@gqlGetRouteWithInfrastructureLinksWithStops');
      cy.wait('@gqlGetStopsAlongInfrastructureLinks');
    }

    if (routePoints) {
      this.map.getLoader().should('not.exist');
      routePoints.forEach((routePoint) => {
        this.map.clickAtPositionFromMapMarkerByTestId(routePoint);
      });

      const lastSnappingPointHandleIndex = routePoints.length - 1;
      this.map.clickNthSnappingPointHandle(lastSnappingPointHandleIndex);
    }

    cy.wait('@mapMatching');

    if (omittedStops) {
      this.map.getLoader().should('not.exist');
      this.routeStopsOverlay.removeStopsFromRoute(omittedStops);
    }

    this.mapFooter.save();
  };

  checkStopSubmitSuccessToast() {
    this.toast.checkSuccessToastHasMessage('Pysäkki luotu');
  }

  checkStopSubmitFailureToast() {
    this.toast.checkDangerToastHasMessage('Tallennus epäonnistui');
  }

  gqlStopShouldBeCreatedSuccessfully() {
    return cy
      .wait('@gqlInsertStop')
      .its('response.statusCode')
      .should('equal', 200);
  }
}
