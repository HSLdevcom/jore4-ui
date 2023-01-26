import { Priority } from '@hsl/jore4-test-db-manager';
import { LineForm } from '../pageObjects';
import { deleteLineByLabel } from './utils';

const testLabel = '7327';
describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  beforeEach(() => {
    lineForm = new LineForm();

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

    lineForm.priorityForm.setPriority(Priority.Standard);
    lineForm.changeValidityForm.setStartDate('2022-01-01');
    lineForm.changeValidityForm.setEndDate('2022-12-31');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();
  });
});
