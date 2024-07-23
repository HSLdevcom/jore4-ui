import { EditRouteModal } from './EditRouteModal';
import { Map } from './Map';
import { MapFooter } from './MapFooter';
import { RouteEditor } from './RouteEditor';
import { RoutePropertiesForm } from './RoutePropertiesForm';
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

  checkStopSubmitSuccessToast() {
    this.toast.checkSuccessToastHasMessage('Pysäkki luotu');
  }

  gqlStopShouldBeCreatedSuccessfully() {
    return cy
      .wait('@gqlInsertStop')
      .its('response.statusCode')
      .should('equal', 200);
  }

  getCloseButton() {
    return cy.getByTestId('MapHeader::closeButton');
  }
}
