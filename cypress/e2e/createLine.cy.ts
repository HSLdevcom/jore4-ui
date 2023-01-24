import { Priority } from '@hsl/jore4-test-db-manager';
import { LineForm } from '../pageObjects';
import { deleteLineByLabel, selectLineByLabel } from './utils';

describe('Verify that creating new line works', () => {
  let lineForm: LineForm;

  beforeEach(() => {
    lineForm = new LineForm();

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

    lineForm.priorityForm.setPriority(Priority.Standard);
    lineForm.changeValidityForm.setStartDate('2022-01-01');
    lineForm.changeValidityForm.setEndDate('2050-01-01');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selectLineByLabel('7327').then((result: any) => {
      cy.wrap(result.rows[0].label).should('equal', '7327');
    });
  });
});
