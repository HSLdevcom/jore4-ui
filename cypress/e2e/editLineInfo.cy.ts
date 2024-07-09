import {
  LineInsertInput,
  Priority,
  RouteTypeOfLineEnum,
  buildLine,
} from '@hsl/jore4-test-db-manager';
import { Tag } from '../enums';
import { LineDetailsPage, LineForm } from '../pageObjects';
import { insertToDbHelper } from '../utils';

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
    type_of_line: RouteTypeOfLineEnum.StoppingBusService,
  },
];

const dbResources = {
  lines,
};

describe('Line editing', () => {
  let lineForm: LineForm;
  let lineDetailsPage: LineDetailsPage;
  beforeEach(() => {
    cy.task('resetDbs');
    lineForm = new LineForm();
    lineDetailsPage = new LineDetailsPage();

    cy.setupTests();
    cy.mockLogin();
    insertToDbHelper(dbResources);
    lineDetailsPage.visit(lines[0].line_id);
  });

  it(
    "Edits a line's name, label and priority",
    { tags: [Tag.Smoke, Tag.Lines] },
    () => {
      lineDetailsPage.getEditLineButton().click();
      lineForm.getLabelInput().clear().type(testInputs.newLabel);
      lineForm.getFinnishNameInput().clear().type(testInputs.newName);
      lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
      lineForm.selectVehicleType('Bussi');
      lineForm.selectLineType('Peruslinja');

      lineForm.priorityForm.setAsDraft();
      lineForm.changeValidityForm.setStartDate('2022-01-01');

      lineForm.save();
      lineForm.checkLineSubmitSuccess();

      lineDetailsPage.getLineName().should('have.text', testInputs.newName);
      lineDetailsPage.getLineLabel().should('have.text', testInputs.newLabel);
      lineDetailsPage.lineValidityPeriod
        .getLinePriority()
        .should('have.text', testInputs.newPriority);
      lineDetailsPage.lineValidityPeriod
        .getLineValidityPeriod()
        .should('have.text', '1.1.2022 - ');
    },
  );
});
