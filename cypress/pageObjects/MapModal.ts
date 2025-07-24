import { expectGraphQLCallToSucceed } from '../utils/assertions';
import { EditRouteModal } from './EditRouteModal';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteEditor } from './RouteEditor';
import { RoutePropertiesForm } from './RoutePropertiesForm';
import { RouteStopsOverlay } from './RouteStopsOverlay';
import { StopAreaForm } from './StopAreaForm';
import { StopAreaPopup } from './StopAreaPopup';
import { NewStopFormInfo, StopForm } from './StopForm';
import { NewTerminalFormInfo, TerminalForm } from './TerminalForm';
import { Toast } from './Toast';

export class MapModal {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  stopForm = new StopForm();

  terminalForm = new TerminalForm();

  stopAreaPopup = new StopAreaPopup();

  stopAreaForm = new StopAreaForm();

  routeStopsOverlay = new RouteStopsOverlay();

  editRouteModal = new EditRouteModal();

  toast = new Toast();

  routeEditor = new RouteEditor();

  /**
   * This creates stop at a location that is specified by percentages of the viewport'sg width and height.
   */
  createStopAtLocation = ({
    stopFormInfo,
    clickRelativePoint,
  }: {
    stopFormInfo: NewStopFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
  }) => {
    this.mapFooter.addStop();

    this.map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    this.stopForm.fillFormForNewStop(stopFormInfo);

    this.stopForm.save();
  };

  /**
   * This creates terminal at a location that is specified by percentages of the viewport'sg width and height.
   */
  createTerminalAtLocation = ({
    terminalFormInfo,
    clickRelativePoint,
  }: {
    terminalFormInfo: NewTerminalFormInfo;
    clickRelativePoint: { xPercentage: number; yPercentage: number };
  }) => {
    this.mapFooter.addTerminal();

    this.map.clickRelativePoint(
      clickRelativePoint.xPercentage,
      clickRelativePoint.yPercentage,
    );

    this.terminalForm.fillFormForNewTerminal(terminalFormInfo);

    this.terminalForm.save();
  };

  checkStopSubmitSuccessToast() {
    this.toast.expectSuccessToast('Pysäkki luotu');
  }

  checkTerminalSubmitSuccessToast() {
    this.toast.expectSuccessToast('Terminaali luotu');
  }

  gqlStopShouldBeCreatedSuccessfully() {
    expectGraphQLCallToSucceed('@gqlInsertStopPoint');
    expectGraphQLCallToSucceed('@gqlInsertQuayIntoStopPlace');
  }

  gqlTerminalShouldBeCreatedSuccessfully() {
    expectGraphQLCallToSucceed('@gqlCreateTerminal');
  }

  getCloseButton() {
    return cy.getByTestId('MapHeader::closeButton');
  }
}
