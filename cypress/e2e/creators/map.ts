import {
  ConfirmSaveForm,
  MapEditor,
  MapFooter,
  RoutePropertiesForm,
  TerminusNameInputs,
} from '../../pageObjects';
import { StopForm } from '../../pageObjects/StopForm';

interface StopPoint {
  x: number;
  y: number;
  stopTestId: string;
}

export enum Priority {
  Standard = 'Standard',
  Draft = 'Draft',
  Temporary = 'Temporary',
}

export enum Direction {
  AwayFromCity = '1',
  TowardsCity = '2',
}

interface RouteFormInfo {
  finnishName: string;
  label: string;
  direction: Direction;
  line: string;
}

interface CreateRouteParameters {
  routeFormInfo: RouteFormInfo;
  priority?: Priority;
  startDate: string;
  endDate?: string;
  routePoints: StopPoint[];
}

export class MapCreator {
  mapEditor = new MapEditor();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  terminusNameInputs = new TerminusNameInputs();

  confirmSaveForm = new ConfirmSaveForm();

  stopForm = new StopForm();

  setPriority = (priority?: string) => {
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

  createRoute = ({
    routeFormInfo,
    priority,
    startDate,
    endDate,
    routePoints,
  }: CreateRouteParameters) => {
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
    this.confirmSaveForm.setStartDate(startDate);
    this.setEndDate(endDate);

    this.routePropertiesForm.save();

    routePoints.forEach((routePoint) => {
      this.mapEditor.clickAtPositionOnRouteEditorFromMapMarkerByTestId(
        routePoint.x,
        routePoint.y,
        routePoint.stopTestId,
      );
    });

    this.mapEditor.clickNthCreatedRectangle(1);
    this.mapFooter.save();
  };
}
