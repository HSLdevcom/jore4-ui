import { Priority } from '@hsl/jore4-test-db-manager';
import {
  ConfirmSaveForm,
  Map,
  MapFooter,
  RouteFormInfo,
  RoutePropertiesForm,
  TerminusNameInputs,
} from '../../pageObjects';
import { ClickPointNearMapMarker } from '../interfaces';

export class MapItemCreator {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  terminusNameInputs = new TerminusNameInputs();

  confirmSaveForm = new ConfirmSaveForm();

  setPriority = (priority?: Priority) => {
    switch (priority) {
      case Priority.Draft:
        this.confirmSaveForm.setAsDraft();
        break;
      case Priority.Temporary:
        this.confirmSaveForm.setAsTemporary();
        break;
      default:
        this.confirmSaveForm.setAsStandard();
    }
  };

  setEndDate = (endDate?: string) => {
    endDate
      ? this.confirmSaveForm.setEndDate(endDate)
      : this.confirmSaveForm.setAsIndefinite();
  };

  /**
   * Create route with UI by giving the necessary information for route creation. This
   * uses ClickPointNearStop array for the route points. This means that you give a stop
   * testId as the origin of the click and then 'right' and 'down' values of where you want
   * to click related to that stop.
   */
  createRoute = ({
    routeFormInfo,
    priority,
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
