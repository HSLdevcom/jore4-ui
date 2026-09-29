import { ReusableComponentsVehicleModeEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../../enums';
import {
  ConfirmationDialog,
  FilterPanel,
  Map,
  MapPage,
  Toast,
} from '../../pageObjects';
import { expectGraphQLCallToSucceed } from '../../utils/assertions';

const testDepotStopLabels = {
  initial: 'D001',
  edited: 'D002',
};

const depotStopLocation = {
  lat: 60.16341342,
  lng: 24.93454635,
};

const rootOpts: Cypress.SuiteConfigOverrides = {
  tags: [Tag.Stops, Tag.Map],
  scrollBehavior: 'bottom',
};

describe('Depot stop editing tests', rootOpts, () => {
  beforeEach(() => {
    cy.task('resetDbs');

    cy.setupTests();
    cy.mockLogin();

    MapPage.map.visit({
      zoom: 16,
      lat: depotStopLocation.lat,
      lng: depotStopLocation.lng,
    });

    MapPage.createDepotStopAtLocation({
      depotStopFormInfo: {
        label: testDepotStopLabels.initial,
        latitude: String(depotStopLocation.lat),
        longitude: String(depotStopLocation.lng),
        validityStartISODate: '2022-01-01',
      },
      clickRelativePoint: {
        xPercentage: 50,
        yPercentage: 50,
      },
    });

    MapPage.gqlDepotStopShouldBeCreatedSuccessfully();
    MapPage.checkStopSubmitSuccessToast();

    FilterPanel.toggleShowStops(ReusableComponentsVehicleModeEnum.Tram);
  });

  it('Should edit a depot stop', () => {
    Map.getDepotStopMarkerByLabel(testDepotStopLabels.initial).click();

    Map.depotStopPopUp.getEditButton().click();

    MapPage.depotStopForm
      .getLabelInput()
      .clearAndType(testDepotStopLabels.edited);

    MapPage.depotStopForm.save();

    expectGraphQLCallToSucceed('@gqlUpdateStopPoint');
    Toast.expectSuccessToast('Pysäkki muokattu');

    Map.getDepotStopMarkerByLabel(testDepotStopLabels.edited).should('exist');
  });

  it('Should move a depot stop', () => {
    Map.getDepotStopMarkerByLabel(testDepotStopLabels.initial).click();

    Map.depotStopPopUp.getMoveButton().click();

    Map.clickRelativePoint(65, 30);

    ConfirmationDialog.getConfirmButton().click();

    expectGraphQLCallToSucceed('@gqlUpdateStopPoint');
    Toast.expectSuccessToast('Pysäkki muokattu');

    Map.getDepotStopMarkerByLabel(testDepotStopLabels.initial).should('exist');
  });

  it('Should delete a depot stop', () => {
    Map.getDepotStopMarkerByLabel(testDepotStopLabels.initial).click();

    Map.depotStopPopUp.getDeleteButton().click();

    ConfirmationDialog.getConfirmButton().click();

    expectGraphQLCallToSucceed('@gqlDeleteDepotStop');
    Toast.expectSuccessToast('Pysäkki poistettu');

    Map.getDepotStopMarkerByLabel(testDepotStopLabels.initial).should(
      'not.exist',
    );
  });
});
