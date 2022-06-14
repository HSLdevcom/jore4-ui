import { ConfirmSaveForm, LineForm } from '../pageObjects';

describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let confirmSaveForm: ConfirmSaveForm;
  beforeEach(() => {
    lineForm = new LineForm();
    confirmSaveForm = new ConfirmSaveForm();
    cy.mockLogin();
    cy.visit('/lines/create');
  });
  it('Creates new line as expected', () => {
    lineForm.getLabelInput().type('7327');
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
