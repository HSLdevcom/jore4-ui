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
import { Toast } from './Toast';

export class MapModal {
  map = new Map();

  mapFooter = new MapFooter();

  routePropertiesForm = new RoutePropertiesForm();

  stopForm = new StopForm();

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

  checkStopSubmitSuccessToast() {
    this.toast.expectSuccessToast('Pysäkki luotu');
  }

  gqlStopShouldBeCreatedSuccessfully() {
    expectGraphQLCallToSucceed('@gqlInsertStopPoint');
    expectGraphQLCallToSucceed('@gqlInsertQuayIntoStopPlace');
  }

  getCloseButton() {
    return cy.getByTestId('MapHeader::closeButton');
  }
}
