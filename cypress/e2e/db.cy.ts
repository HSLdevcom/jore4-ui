import { LineForm } from '../pageObjects';

describe('Example test suite that demonstrates how to access db in tests', () => {
  let lineForm: LineForm;

  beforeEach(() => {
    lineForm = new LineForm();
    cy.task('checkDbConnection');
    // Uncomment to truncate db. Please note that e2e tests use same db as dev enrionment does, so
    // truncating db truncates also dev db.
    // cy.task('truncateDb');
    cy.mockLogin();
    cy.visit('/lines/create');
  });
  it('example test content', () => {
    lineForm.getLabelInput().type('7327');
  });
});
