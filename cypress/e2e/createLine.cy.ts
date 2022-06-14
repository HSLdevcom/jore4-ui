import { ConfirmSaveForm, LineForm } from '../pageObjects';

const deleteLineByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."line" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

const testLabel = '7327';
describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let confirmSaveForm: ConfirmSaveForm;
  beforeEach(() => {
    lineForm = new LineForm();
    confirmSaveForm = new ConfirmSaveForm();
    cy.mockLogin();
    cy.visit('/lines/create');
    // delete label we are about to create (if exists) to avoid
    // possible constraint violation
    deleteLineByLabel(testLabel);
  });
  it('Creates new line as expected', () => {
    lineForm.getLabelInput().type(testLabel);
    lineForm.getFinnishNameInput().type('Testilinja');
    lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
    lineForm.selectVehicleType('Bussi');
    lineForm.selectLineType('Peruslinja');

    confirmSaveForm.setAsDraft();
    confirmSaveForm.setStartDate('2022-01-01');
    confirmSaveForm.setEndDate('2022-12-31');

    lineForm.save();
    lineForm.checkSubmitSuccess();
  });
});
