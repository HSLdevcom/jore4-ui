import { Priority } from '@hsl/jore4-test-db-manager';
import { ConfirmSaveForm } from './ConfirmSaveForm';
import { EditRouteModal } from './EditRouteModal';
import { ClickPointNearMapMarker, Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteFormInfo, RoutePropertiesForm } from './RoutePropertiesForm';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopForm, StopFormInfo } from './StopForm';
import { TerminusNameInputs } from './TerminusNameInputs';
import { Toast } from './Toast';

export class MapItemCreator {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  terminusNameInputs = new TerminusNameInputs();

  confirmSaveForm = new ConfirmSaveForm();

  stopForm = new StopForm();

  routeStopsOverlay = new RouteStopsOverlay();

  editRouteModal = new EditRouteModal();

  toast = new Toast();

  setPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.Draft:
        this.confirmSaveForm.setAsDraft();
        break;
      case Priority.Temporary:
        this.confirmSaveForm.setAsTemporary();
        break;
      case Priority.Standard:
        this.confirmSaveForm.setAsStandard();
        break;
      default:
    }
  };

  setEndDate = (isoDate?: string) => {
    if (isoDate) {
      this.confirmSaveForm.setAsIndefinite(false);
      this.confirmSaveForm.setEndDate(isoDate);
    } else {
      this.confirmSaveForm.setAsIndefinite();
    }
  };

  /**
   * Creates stop using ClickPointNear stop.
   * This means that you give a stop testId as the origin of the click
   * and then 'right' and 'down' values of where you want to click
   * related to that stop.
   */
  createStopNextToAnotherStop = ({
    stopFormInfo,
    stopPoint,
    priority = Priority.Standard,
    validityStartISODate,
    validityEndISODate,
  }: {
    stopFormInfo: StopFormInfo;
    stopPoint: ClickPointNearMapMarker;
    priority?: Priority;
    validityStartISODate: string;
    validityEndISODate?: string;
  }) => {
    this.mapFooter.addStop();

    this.map.clickAtPositionFromMapMarkerByTestId(stopPoint);

    this.stopForm.fillStopForm(stopFormInfo);

    this.setPriority(priority);

    this.confirmSaveForm.setStartDate(validityStartISODate);
    this.setEndDate(validityEndISODate);

    this.stopForm.save();
  };

  /**
   * This creates stop at a location that is specified by percentages of the viewport'sg width and height.
   */

  createStopAtLocation = ({
    stopFormInfo,
    clickRelativePoint,
    priority = Priority.Standard,
    validityStartISODate,
    validityEndISODate,
  }: {
    stopFormInfo: StopFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
    priority?: Priority;
    validityStartISODate: string;
    validityEndISODate?: string;
  }) => {
    this.mapFooter.addStop();

    this.map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    this.stopForm.fillStopForm(stopFormInfo);

    this.setPriority(priority);

    this.confirmSaveForm.setStartDate(validityStartISODate);
    this.setEndDate(validityEndISODate);

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
    priority = Priority.Standard,
    validityStartISODate,
    validityEndISODate,
    routePoints,
    omittedStops,
  }: {
    routeFormInfo: RouteFormInfo;
    priority?: Priority;
    validityStartISODate: string;
    validityEndISODate?: string;
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

    this.setPriority(priority);
    this.confirmSaveForm.setStartDate(validityStartISODate);
    this.setEndDate(validityEndISODate);

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

  checkStopSubmitSuccess() {
    this.toast.checkSuccessToastHasMessage('Pysäkki luotu');
  }

  checkStopSubmitFailure() {
    this.toast.checkDangerToastHasMessage('Tallennus epäonnistui');
  }
}
