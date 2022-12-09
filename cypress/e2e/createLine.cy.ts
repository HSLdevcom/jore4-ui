import { Priority } from '@hsl/jore4-test-db-manager';
import { ChangeValidityForm, LineForm } from '../pageObjects';
import { deleteLineByLabel } from './utils';

const testLabel = '7327';
describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let changeValidityForm: ChangeValidityForm;
  beforeEach(() => {
    lineForm = new LineForm();
    changeValidityForm = new ChangeValidityForm();

    cy.setupTests();
    cy.mockLogin();
    cy.visit('/lines/create');
    // delete label we are about to create (if exists) to avoid
    // possible constraint violation
    deleteLineByLabel(testLabel);
  });
  after(() => {
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

    changeValidityForm.setPriority(Priority.Standard);
    changeValidityForm.setStartDate('2022-01-01');
    changeValidityForm.setEndDate('2022-12-31');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();
  });
});
