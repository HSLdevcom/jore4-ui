import {
  buildLine,
  buildRoute,
  LineInsertInput,
  Priority,
  RouteInsertInput,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager';
import {
  EditRoutePage,
  LineDetailsPage,
  RoutesAndLinesPage,
  SearchResultsPage,
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '3999' }),
    line_id: '77410a6f-7f6a-4f4f-b303-d03f4a56a38e',
  },
];

const routes: RouteInsertInput[] = [
  {
    ...buildRoute({ label: '9999' }),
    route_id: '053a5d5d-5b44-488b-9f52-5839a63c3c21',
    name_i18n: 'Alkuperäinen nimi',
    direction: RouteDirectionEnum.Inbound,
    on_line_id: lines[0].line_id,
  },
];

const dbResources = {
  lines,
  routes,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Route meta information editing', () => {
  let editRoutePage: EditRoutePage;
  let lineDetailsPage: LineDetailsPage;
  let toast: Toast;
  let routesAndLinesPage: RoutesAndLinesPage;
  let searchResultsPage: SearchResultsPage;

  before(() => {
    deleteCreatedResources();
  });
  beforeEach(() => {
    editRoutePage = new EditRoutePage();
    lineDetailsPage = new LineDetailsPage();
    toast = new Toast();
    routesAndLinesPage = new RoutesAndLinesPage();
    searchResultsPage = new SearchResultsPage();

    cy.setupTests();
    cy.mockLogin();
    insertToDbHelper(dbResources);
    editRoutePage.visit(routes[0].route_id);
  });
  afterEach(() => {
    deleteCreatedResources();
  });

  it("Edits a routes's information", () => {
    editRoutePage.routePropertiesForm.fillRouteProperties({
      finnishName: 'Muokattu reitin nimi',
      label: 'Muokattu label',
      direction: RouteDirectionEnum.Outbound,
    });
    editRoutePage.terminusNamesInputs.fillTerminusNameInputsForm(
      {
        finnishName: 'Muokattu lähtöpaikka FIN',
        finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
        swedishName: 'Muokattu lähtöpaikka SWE',
        swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
      },
      {
        finnishName: 'Muokattu määränpää FIN',
        finnishShortName: 'Muokattu määränpää FIN lyhennys',
        swedishName: 'Muokattu määränpää SWE',
        swedishShortName: 'Muokattu määränpää SWE lyhennys',
      },
    );
    editRoutePage.changeValidityForm.setAsTemporary();
    editRoutePage.changeValidityForm.getIndefiniteCheckbox().click();
    editRoutePage.changeValidityForm.setStartDate('2022-01-01');
    editRoutePage.changeValidityForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    lineDetailsPage.routeStopsTable
      .getRouteName()
      .should('contain', 'Muokattu reitin nimi');
    lineDetailsPage.routeStopsTable.getRouteHeaderRow('Muokattu label');
    lineDetailsPage.routeStopsTable.routeDirectionShouldBeOutbound(
      'Muokattu label',
    );
    lineDetailsPage.routeStopsTable
      .getRouteValidityPeriod('Muokattu label')
      .should('contain', '1.1.2022 - 31.12.2030');

    editRoutePage.visit(routes[0].route_id);
    editRoutePage.terminusNamesInputs
      .getTerminusOriginFinnishNameInput()
      .should('have.value', 'Muokattu lähtöpaikka FIN');
    editRoutePage.terminusNamesInputs
      .getTerminusOriginFinnishShortNameInput()
      .should('have.value', 'Muokattu lähtöpaikka FIN lyhennys');
    editRoutePage.terminusNamesInputs
      .getTerminusOriginSwedishNameInput()
      .should('have.value', 'Muokattu lähtöpaikka SWE');
    editRoutePage.terminusNamesInputs
      .getTerminusOriginSwedishShortNameInput()
      .should('have.value', 'Muokattu lähtöpaikka SWE lyhennys');
    editRoutePage.terminusNamesInputs
      .getTerminusDestinationFinnishNameInput()
      .should('have.value', 'Muokattu määränpää FIN');
    editRoutePage.terminusNamesInputs
      .getTerminusDestinationFinnishShortNameInput()
      .should('have.value', 'Muokattu määränpää FIN lyhennys');
    editRoutePage.terminusNamesInputs
      .getTerminusDestinationSwedishNameInput()
      .should('have.value', 'Muokattu määränpää SWE');
    editRoutePage.terminusNamesInputs
      .getTerminusDestinationSwedishShortNameInput()
      .should('have.value', 'Muokattu määränpää SWE lyhennys');
    editRoutePage.changeValidityForm.assertSelectedPriority(Priority.Standard);
  });

  it('Deletes a route', () => {
    editRoutePage.routePropertiesForm.getForm().should('be.visible');
    editRoutePage.getDeleteRouteButton().click();
    editRoutePage.confirmationDialog.getConfirmButton().click();
    cy.wait('@gqlDeleteRoute').its('response.statusCode').should('equal', 200);
    toast.checkSuccessToastHasMessage('Reitti poistettu');
    editRoutePage.visit(routes[0].route_id);
    editRoutePage.routePropertiesForm.getForm().should('not.exist');
    cy.visit('/routes');
    routesAndLinesPage
      .getRoutesAndLinesSearchInput()
      .type(`${routes[0].label}{enter}`);
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage.getRoutesResultsButton().click();
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', '0 hakutulosta');
  });
});
