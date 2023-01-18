import {
  buildLine,
  LineInsertInput,
  Priority,
} from '@hsl/jore4-test-db-manager';
import { ChangeValidityForm, LineDetailsPage, LineForm } from '../pageObjects';
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

describe.skip('Line editing', () => {
  let lineForm: LineForm;
  let changeValidityForm: ChangeValidityForm;
  let lineDetailsPage: LineDetailsPage;
  before(() => {
    deleteCreatedResources();
  });
  beforeEach(() => {
    lineForm = new LineForm();
    changeValidityForm = new ChangeValidityForm();
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

    changeValidityForm.setAsDraft();
    changeValidityForm.setStartDate('2022-01-01');

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
