import { Priority } from '@hsl/jore4-test-db-manager';
import {
  ConfirmSaveForm,
  Map,
  MapFooter,
  RouteFormInfo,
  RoutePropertiesForm,
  StopForm,
  StopFormInfo,
  TerminusNameInputs,
} from '../../pageObjects';
import { ClickPointNearMapMarker, Coordinates } from '../../types';

export class MapItemCreator {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  terminusNameInputs = new TerminusNameInputs();

  confirmSaveForm = new ConfirmSaveForm();

  stopForm = new StopForm();

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
    isoDate
      ? this.confirmSaveForm.setEndDate(isoDate)
      : this.confirmSaveForm.setAsIndefinite();
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
    startISODate,
    endISODate,
  }: {
    stopFormInfo: StopFormInfo;
    stopPoint: ClickPointNearMapMarker;
    priority?: Priority;
    startISODate: string;
    endISODate?: string;
  }) => {
    this.mapFooter.addStop();

    this.map.clickAtPositionFromMapMarkerByTestId(stopPoint);

    this.stopForm.fillStopForm(stopFormInfo);

    this.setPriority(priority);

    this.confirmSaveForm.setStartDate(startISODate);
    this.setEndDate(endISODate);

    this.stopForm.save();
  };

  /**
   * This creates stop to a location pointed out with x and y coordinate.
   */
  createStopAtLocation = ({
    stopFormInfo,
    clickCoordinates,
    priority = Priority.Standard,
    startISODate,
    endISODate,
  }: {
    stopFormInfo: StopFormInfo;
    clickCoordinates: Coordinates;
    priority?: Priority;
    startISODate: string;
    endISODate?: string;
  }) => {
    this.mapFooter.addStop();

    this.map.clickAtPosition(clickCoordinates.x, clickCoordinates.y);

    this.stopForm.fillStopForm(stopFormInfo);

    this.setPriority(priority);

    this.confirmSaveForm.setStartDate(startISODate);
    this.setEndDate(endISODate);

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
    startISODate,
    endISODate,
    routePoints,
  }: {
    routeFormInfo: RouteFormInfo;
    priority?: Priority;
    startISODate: string;
    endISODate?: string;
    routePoints: ClickPointNearMapMarker[];
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
    this.confirmSaveForm.setStartDate(startISODate);
    this.setEndDate(endISODate);

    this.routePropertiesForm.save();

    routePoints.forEach((routePoint) => {
      this.map.clickAtPositionFromMapMarkerByTestId(routePoint);
    });

    const lastSnappingPointHandleIndex = routePoints.length - 1;
    this.map.clickNthSnappingPointHandle(lastSnappingPointHandleIndex);
    this.mapFooter.save();
  };
}
