import { RouteAndLineSearchForm } from '../pageObjects';

describe('Verify route and line search works', () => {
  let routeSearchForm: RouteAndLineSearchForm;
  beforeEach(() => {
    routeSearchForm = new RouteAndLineSearchForm();
    cy.setupTests();
    cy.mockLogin();
    cy.visit('/routes');
  });
  it('Searches line with exact ID', () => {
    routeSearchForm.getRouteSearchFormSearchField().type('1{enter}');
    routeSearchForm.getLineSearchResultTable().should('contain', 'line 1');
    routeSearchForm
      .getLineSearchResultTable()
      .should('not.contain', 'Erottaja - Arkkadiankatu FI');
  });

  it('Searches line with asterisk', () => {
    routeSearchForm.getRouteSearchFormSearchField().type('1*{enter}');
    routeSearchForm.getLineSearchResultTable().should('contain', 'line 1');
    routeSearchForm
      .getLineSearchResultTable()
      .should('contain', 'Erottaja - Arkkadiankatu FI');
  });
});
