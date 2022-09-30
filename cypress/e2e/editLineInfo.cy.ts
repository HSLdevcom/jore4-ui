import {
  buildLine,
  LineInsertInput,
  Priority,
} from '@hsl/jore4-test-db-manager';
import { ConfirmSaveForm, LineForm, LineDetailsPage } from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const testInputs = {
  newLabel: 'Muokattu label 1999',
  newName: 'Muokattu nimi Testilinja FI',
  newPriority: 'Luonnos',
};

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: '1999' }),
    line_id: '9e800038-3fbb-11ed-b878-0242ac120002',
    priority: Priority.Standard,
  },
];

const dbResources = {
  lines,
};

const deleteCreatedResources = () => {
  removeFromDbHelper(dbResources);
};

describe('Line editing', () => {
  let lineForm: LineForm;
  let confirmSaveForm: ConfirmSaveForm;
  let lineDetailsPage: LineDetailsPage;
  before(() => {
    deleteCreatedResources();
  });
  beforeEach(() => {
    lineForm = new LineForm();
    confirmSaveForm = new ConfirmSaveForm();
    lineDetailsPage = new LineDetailsPage();

    cy.setupTests();
    cy.mockLogin();
    insertToDbHelper(dbResources);
    lineDetailsPage.visit(lines[0].line_id);
  });
  afterEach(() => {
    deleteCreatedResources();
  });

  it("Edits a line's name, label and priority", () => {
    lineDetailsPage.getEditLineButton().click();
    lineForm.getLabelInput().clear().type(testInputs.newLabel);
    lineForm.getFinnishNameInput().clear().type(testInputs.newName);
    lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
    lineForm.selectVehicleType('Bussi');
    lineForm.selectLineType('Peruslinja');

    confirmSaveForm.setAsDraft();
    confirmSaveForm.setStartDate('2022-01-01');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();

    lineDetailsPage.getLineName().should('have.text', testInputs.newName);
    lineDetailsPage.getLineLabel().should('have.text', testInputs.newLabel);
    lineDetailsPage
      .getLinePriority()
      .should('have.text', testInputs.newPriority);
    lineDetailsPage.getLineValidityPeriod().should('have.text', '1.1.2022 - ');
  });
});
