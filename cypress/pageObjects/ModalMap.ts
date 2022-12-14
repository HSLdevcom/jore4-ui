import {
  ChangeValidityForm,
  ChangeValidityFormInfo,
} from './ChangeValidityForm';
import { EditRouteModal } from './EditRouteModal';
import { ClickPointNearMapMarker, Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteFormInfo, RoutePropertiesForm } from './RoutePropertiesForm';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopForm, StopFormInfo } from './StopForm';
import { TerminusNameInputs } from './TerminusNameInputs';
import { Toast } from './Toast';

export class ModalMap {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  terminusNameInputs = new TerminusNameInputs();

  changeValidityForm = new ChangeValidityForm();

  stopForm = new StopForm();

  routeStopsOverlay = new RouteStopsOverlay();

  editRouteModal = new EditRouteModal();

  toast = new Toast();

  /**
   * Creates stop using ClickPointNear stop.
   * This means that you give a stop testId as the origin of the click
   * and then 'right' and 'down' values of where you want to click
   * related to that stop.
   */
  createStopNextToAnotherStop = ({
    stopFormInfo,
    changeValidityFormInfo,
    stopPoint,
  }: {
    stopFormInfo: StopFormInfo;
    changeValidityFormInfo: ChangeValidityFormInfo;
    stopPoint: ClickPointNearMapMarker;
  }) => {
    this.mapFooter.addStop();

    this.map.clickAtPositionFromMapMarkerByTestId(stopPoint);

    this.stopForm.fillForm(stopFormInfo);
    this.changeValidityForm.fillForm(changeValidityFormInfo);

    this.stopForm.save();
  };

  /**
   * This creates stop at a location that is specified by percentages of the viewport'sg width and height.
   */
  createStopAtLocation = ({
    stopFormInfo,
    changeValidityFormInfo,
    clickRelativePoint,
  }: {
    stopFormInfo: StopFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
    changeValidityFormInfo: ChangeValidityFormInfo;
  }) => {
    this.mapFooter.addStop();

    this.map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    this.stopForm.fillForm(stopFormInfo);
    this.changeValidityForm.fillForm(changeValidityFormInfo);

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
    changeValidityFormInfo,
    routePoints,
    omittedStops,
  }: {
    routeFormInfo: RouteFormInfo;
    changeValidityFormInfo: ChangeValidityFormInfo;
    routePoints: ClickPointNearMapMarker[];
    omittedStops?: string[];
  }) => {
    this.mapFooter.createRoute();

    this.routePropertiesForm.fillRouteProperties(routeFormInfo);

    this.terminusNameInputs.fillTerminusNameInputsForm(
      {
        finnishName: 'Lähtöpaikka',
        swedishName: 'Ursprung',
        finnishShortName: 'LP',
        swedishShortName: 'UP',
      },
      {
        finnishName: 'Määränpää',
        swedishName: 'Ändstation',
        finnishShortName: 'MP',
        swedishShortName: 'ÄS',
      },
    );

    this.changeValidityForm.fillForm(changeValidityFormInfo);
    this.editRouteModal.save();

    routePoints.forEach((routePoint) => {
      this.map.clickAtPositionFromMapMarkerByTestId(routePoint);
    });

    const lastSnappingPointHandleIndex = routePoints.length - 1;
    this.map.clickNthSnappingPointHandle(lastSnappingPointHandleIndex);
    if (omittedStops) {
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
