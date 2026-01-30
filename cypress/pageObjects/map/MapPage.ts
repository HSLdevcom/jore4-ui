import { expectGraphQLCallToSucceed } from '../../utils/assertions';
import { RoutePropertiesForm } from '../forms/RoutePropertiesForm';
import { StopAreaForm } from '../forms/StopAreaForm';
import { NewStopFormInfo, StopForm } from '../forms/StopForm';
import { NewTerminalFormInfo, TerminalForm } from '../forms/TerminalForm';
import { EditRouteModal } from '../routes-and-lines/EditRouteModal';
import { Toast } from '../shared-components/Toast';
import { StopAreaPopup } from '../stop-registry/StopAreaPopup';
import { TerminalPopup } from '../stop-registry/TerminalPopup';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteEditor } from './RouteEditor';
import { RouteStopsOverlay } from './RouteStopsOverlay';

export class MapPage {
  static map = Map;

  static mapFooter = MapFooter;

  static routePropertiesForm = RoutePropertiesForm;

  static stopForm = StopForm;

  static terminalForm = TerminalForm;

  static stopAreaPopup = StopAreaPopup;

  static terminalPopup = TerminalPopup;

  static stopAreaForm = StopAreaForm;

  static routeStopsOverlay = RouteStopsOverlay;

  static editRouteModal = EditRouteModal;

  static routeEditor = RouteEditor;

  static toast = Toast;

  /**
   * This creates stop at a location that is specified by percentages of the viewport'sg width and height.
   */
  static createStopAtLocation({
    stopFormInfo,
    clickRelativePoint,
  }: {
    stopFormInfo: NewStopFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
  }) {
    MapFooter.addStop();

    Map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    StopForm.fillFormForNewStop(stopFormInfo);

    StopForm.save();
  }

  /**
   * This creates terminal at a location that is specified by percentages of the viewport'sg width and height.
   */
  static createTerminalAtLocation({
    terminalFormInfo,
    clickRelativePoint,
  }: {
    terminalFormInfo: NewTerminalFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
  }) {
    MapFooter.addTerminal();

    Map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    TerminalForm.fillFormForNewTerminal(terminalFormInfo);

    const privateCode = TerminalForm.getPrivateCodeInput()
      .shouldBeVisible()
      .shouldBeDisabled()
      .invoke('val');

    TerminalForm.save();

    return privateCode;
  }

  static checkStopSubmitSuccessToast() {
    Toast.expectSuccessToast('Pysäkki luotu');
  }

  static checkTerminalSubmitSuccessToast() {
    Toast.expectSuccessToast('Terminaali luotu');
  }

  static gqlStopShouldBeCreatedSuccessfully() {
    expectGraphQLCallToSucceed('@gqlInsertStopPoint');
    expectGraphQLCallToSucceed('@gqlInsertQuayIntoStopPlace');
  }

  static gqlTerminalShouldBeCreatedSuccessfully() {
    expectGraphQLCallToSucceed('@gqlCreateTerminal');
  }

  static getCloseButton() {
    // Assume the button is going to be clicked.
    // Allow the browser to flush the event queue, and the Map & React to
    // settle down and finish any pending Router navigation state changes,
    // before navigating back to previous page.

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1);

    return cy.getByTestId('MapHeader::closeButton');
  }
}
