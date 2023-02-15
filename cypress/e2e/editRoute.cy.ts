import {
  buildLine,
  buildRoute,
  LineInsertInput,
  RouteInsertInput,
  RouteDirectionEnum,
} from '@hsl/jore4-test-db-manager';
import { Tag } from '../enums';
import {
  EditRoutePage,
  LineDetailsPage,
  RoutesAndLinesPage,
  SearchResultsPage,
  TerminusValues,
  Toast,
} from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const routeFormTestInputs = {
  finnishName: 'Muokattu reitin nimi',
  label: 'Muokattu label',
  variant: '9191',
  direction: RouteDirectionEnum.Outbound,
};

const originTestInputs: TerminusValues = {
  finnishName: 'Muokattu lähtöpaikka FIN',
  finnishShortName: 'Muokattu lähtöpaikka FIN lyhennys',
  swedishName: 'Muokattu lähtöpaikka SWE',
  swedishShortName: 'Muokattu lähtöpaikka SWE lyhennys',
};

const destinationTestInputs: TerminusValues = {
  finnishName: 'Muokattu määränpää FIN',
  finnishShortName: 'Muokattu määränpää FIN lyhennys',
  swedishName: 'Muokattu määränpää SWE',
  swedishShortName: 'Muokattu määränpää SWE lyhennys',
};

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  it("Edits a routes's information", { tags: Tag.Routes }, () => {
    // Edit the route's information
    editRoutePage.routePropertiesForm.fillRouteProperties(routeFormTestInputs);
    editRoutePage.terminusNamesInputs.fillTerminusNameInputsForm(
      originTestInputs,
      destinationTestInputs,
    );
    editRoutePage.priorityForm.setAsTemporary();
    editRoutePage.changeValidityForm.getIndefiniteCheckbox().click();
    editRoutePage.changeValidityForm.setStartDate('2022-01-01');
    editRoutePage.changeValidityForm.setEndDate('2030-12-31');

    editRoutePage.getSaveRouteButton().click();

    // Verify information after transitioning to the line details page
    lineDetailsPage.routeStopsTable
      .getRouteName()
      .should('contain', routeFormTestInputs.finnishName);
    lineDetailsPage.routeStopsTable.getRouteHeaderRow(
      routeFormTestInputs.label,
    );
    lineDetailsPage.routeStopsTable.routeDirectionShouldBeOutbound(
      routeFormTestInputs.label,
    );
    lineDetailsPage.routeStopsTable
      .getRouteValidityPeriod(routeFormTestInputs.label)
      .should('contain', '1.1.2022 - 31.12.2030');

    // Verify rest of the information from the edit route page
    editRoutePage.visit(routes[0].route_id);
    editRoutePage.routePropertiesForm
      .getVariantInput()
      .should('have.value', '9191');
    editRoutePage.terminusNamesInputs.verifyOriginValues(originTestInputs);
    editRoutePage.terminusNamesInputs.verifyDestinationValues(
      destinationTestInputs,
    );
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  it('Deletes a route', { tags: Tag.Routes }, () => {
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
