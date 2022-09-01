import { ConfirmSaveForm, LineForm, Toast } from '../pageObjects';
import { deleteLineByLabel } from './utils/db-utils';

const testLabel = '7327';
describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let confirmSaveForm: ConfirmSaveForm;
  let toast: Toast;
  beforeEach(() => {
    lineForm = new LineForm();
    confirmSaveForm = new ConfirmSaveForm();
    toast = new Toast();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/lines/create');
    // delete label we are about to create (if exists) to avoid
    // possible constraint violation
    deleteLineByLabel(testLabel);
  });
  it('Creates new line as expected', () => {
    lineForm.getLabelInput().type(testLabel);
    lineForm.getFinnishNameInput().type('Testilinja FI');
    lineForm.getSwedishNameInput().type('Testilinja SV');
    lineForm.getFinnishShortNameInput().type('Testilinja lyhyt FI');
    lineForm.getSwedishShortNameInput().type('Testilinja lyhyt SV');
    lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
    lineForm.selectVehicleType('Bussi');
    lineForm.selectLineType('Peruslinja');

    confirmSaveForm.setAsDraft();
    confirmSaveForm.setStartDate('2022-01-01');
    confirmSaveForm.setEndDate('2022-12-31');

    lineForm.save();
    toast.checkLineSubmitSuccess();
  });
});
