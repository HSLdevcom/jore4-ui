import { Priority } from '@hsl/jore4-test-db-manager';
import {
  ChangeValidityForm,
  LineForm,
  RoutesAndLinesPage,
  SearchResultsPage,
} from '../pageObjects';
import { deleteLineByLabel } from './utils';

describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let changeValidityForm: ChangeValidityForm;
  let routesAndLinesPage: RoutesAndLinesPage;
  let searchResultsPage: SearchResultsPage;

  beforeEach(() => {
    lineForm = new LineForm();
    changeValidityForm = new ChangeValidityForm();
    routesAndLinesPage = new RoutesAndLinesPage();
    searchResultsPage = new SearchResultsPage();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/lines/create');
    // delete label we are about to create (if exists) to avoid
    // possible constraint violation
    deleteLineByLabel('7327');
  });
  after(() => {
    deleteLineByLabel('7327');
  });
  it('Creates new line as expected', () => {
    lineForm.getLabelInput().type('7327');
    lineForm.getFinnishNameInput().type('Testilinja FI');
    lineForm.getSwedishNameInput().type('Testilinja SV');
    lineForm.getFinnishShortNameInput().type('Testilinja lyhyt FI');
    lineForm.getSwedishShortNameInput().type('Testilinja lyhyt SV');
    lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
    lineForm.selectVehicleType('Bussi');
    lineForm.selectLineType('Peruslinja');

    changeValidityForm.setPriority(Priority.Standard);
    changeValidityForm.setStartDate('2022-01-01');
    changeValidityForm.setEndDate('2050-01-01');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();

    cy.visit('/routes');
    routesAndLinesPage.getRoutesAndLinesSearchInput().type(`7327{enter}`);
    cy.wait('@gqlSearchLinesAndRoutes');
    searchResultsPage
      .getSearchResultsContainer()
      .should('contain', 'hakutulosta');
    searchResultsPage.getLinesSearchResultTable().should('contain', '7327');
  });
});
