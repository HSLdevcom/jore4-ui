import {
  LineInsertInput,
  Priority,
  RouteTypeOfLineEnum,
  buildLine,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../enums';
import {
  LineDetailsPage,
  LineForm,
  LineValidityPeriod,
  ObservationDateControl,
  PriorityForm,
  ValidityPeriodForm,
} from '../pageObjects';
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

describe('Lines', { tags: [Tag.Lines] }, () => {
  beforeEach(() => {
    cy.task('resetDbs');
    cy.setupTests();
    cy.mockLogin();
  });

  describe('Line creation', () => {
    beforeEach(() => {
      cy.visit('/lines/create');
    });

    it('Creates new line as expected', { tags: [Tag.Smoke] }, () => {
      LineForm.getLabelInput().type('7327');
      LineForm.getFinnishNameInput().type('Testilinja FI');
      LineForm.getSwedishNameInput().type('Testilinja SV');
      LineForm.getFinnishShortNameInput().type('Testilinja lyhyt FI');
      LineForm.getSwedishShortNameInput().type('Testilinja lyhyt SV');
      LineForm.selectTransportTarget('Helsingin sisäinen liikenne');
      LineForm.selectVehicleType('Bussi');
      LineForm.selectLineType('Peruslinja');
      LineForm.getLineTextInput().type('Linjateksti');

      LineForm.priorityForm.setPriority(Priority.Standard);
      ValidityPeriodForm.setStartDate('2022-01-01');
      ValidityPeriodForm.setEndDate('2050-01-01');

      LineForm.save();
      LineForm.checkLineSubmitSuccess();

      LineValidityPeriod.getLineValidityPeriod().should(
        'contain',
        '1.1.2022 - 1.1.2050',
      );
      LineDetailsPage.getLineName().should('contain', 'Testilinja FI');
      LineDetailsPage.getLineLabel().should('contain', '7327');
      LineDetailsPage.getTransportTarget().should(
        'contain',
        'Helsingin sisäinen liikenne',
      );
      LineDetailsPage.getPrimaryVehicleMode().should('contain', 'Bussi');
      LineDetailsPage.getTypeOfLine().should('contain', 'Peruslinja');

      // Check line text from edit page
      LineDetailsPage.getEditLineButton().click();
      LineForm.getLineTextInput().should('have.text', 'Linjateksti');
      LineForm.cancel();
    });
  });

  describe('Line editing', () => {
    beforeEach(() => {
      insertToDbHelper(dbResources);
      LineDetailsPage.visit(lines[0].line_id);
    });

    it("Edits a line's name, label, priority and line text", () => {
      LineDetailsPage.getEditLineButton().click();
      LineForm.getLabelInput().clearAndType(testInputs.newLabel);
      LineForm.getFinnishNameInput().clearAndType(testInputs.newName);
      LineForm.selectTransportTarget('Helsingin sisäinen liikenne');
      LineForm.selectVehicleType('Bussi');
      LineForm.selectLineType('Peruslinja');
      LineForm.getLineTextInput().clearAndType('Muokattu linjateksti');

      PriorityForm.setAsDraft();
      ValidityPeriodForm.setStartDate('2022-01-01');

      LineForm.save();
      LineForm.checkLineSubmitSuccess();

      LineDetailsPage.getLineName().should('have.text', testInputs.newName);
      LineDetailsPage.getLineLabel().should('have.text', testInputs.newLabel);
      LineValidityPeriod.getLinePriority().should(
        'have.text',
        testInputs.newPriority,
      );
      LineValidityPeriod.getLineValidityPeriod().should(
        'have.text',
        '1.1.2022 - ',
      );

      // Check line text from edit page
      LineDetailsPage.getEditLineButton().click();
      LineForm.getLineTextInput().should('have.text', 'Muokattu linjateksti');
      LineForm.cancel();
    });

    it('should show not valid for selected day text', () => {
      LineDetailsPage.getEditLineButton().click();
      ValidityPeriodForm.setStartDate('2022-01-01');
      LineForm.save();
      const beforeValidityPeriod = '2021-01-31';
      ObservationDateControl.setObservationDate(beforeValidityPeriod);
      cy.getByTestId('LineMissingBox::notValidText').should('be.visible');

      const withinValidityPeriod = '2022-01-01';
      ObservationDateControl.setObservationDate(withinValidityPeriod);
      cy.getByTestId('LineMissingBox::notValidText').should('not.exist');
    });
  });
});
