import {
  LineInsertInput,
  Priority,
  RouteTypeOfLineEnum,
  buildLine,
} from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../enums';
import { LineDetailsPage, LineForm } from '../pageObjects';
import { ObservationDateControl } from '../pageObjects/ObservationDateControl';
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

describe('Lines', () => {
  let lineForm: LineForm;
  let lineDetailsPage: LineDetailsPage;
  let observationDateControl: ObservationDateControl;

  beforeEach(() => {
    cy.task('resetDbs');
    lineForm = new LineForm();
    lineDetailsPage = new LineDetailsPage();
    observationDateControl = new ObservationDateControl();

    cy.setupTests();
    cy.mockLogin();
  });

  describe('Line creation', () => {
    beforeEach(() => {
      cy.visit('/lines/create');
    });

    it('Creates new line as expected', { tags: [Tag.Smoke, Tag.Lines] }, () => {
      lineForm.getLabelInput().type('7327');
      lineForm.getFinnishNameInput().type('Testilinja FI');
      lineForm.getSwedishNameInput().type('Testilinja SV');
      lineForm.getFinnishShortNameInput().type('Testilinja lyhyt FI');
      lineForm.getSwedishShortNameInput().type('Testilinja lyhyt SV');
      lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
      lineForm.selectVehicleType('Bussi');
      lineForm.selectLineType('Peruslinja');
      lineForm.getLineTextInput().type('Linjateksti');

      lineForm.priorityForm.setPriority(Priority.Standard);
      lineForm.changeValidityForm.validityPeriodForm.setStartDate('2022-01-01');
      lineForm.changeValidityForm.validityPeriodForm.setEndDate('2050-01-01');

      lineForm.save();
      lineForm.checkLineSubmitSuccess();

      lineDetailsPage.lineValidityPeriod
        .getLineValidityPeriod()
        .should('contain', '1.1.2022 - 1.1.2050');
      lineDetailsPage.getLineName().should('contain', 'Testilinja FI');
      lineDetailsPage.getLineLabel().should('contain', '7327');
      lineDetailsPage
        .getTransportTarget()
        .should('contain', 'Helsingin sisäinen liikenne');
      lineDetailsPage.getPrimaryVehicleMode().should('contain', 'Bussi');
      lineDetailsPage.getTypeOfLine().should('contain', 'Peruslinja');

      // Check line text from edit page
      lineDetailsPage.getEditLineButton().click();
      lineForm.getLineTextInput().should('have.text', 'Linjateksti');
      lineForm.cancel();
    });
  });

  describe('Line editing', () => {
    beforeEach(() => {
      insertToDbHelper(dbResources);
      lineDetailsPage.visit(lines[0].line_id);
    });

    it(
      "Edits a line's name, label, priority and line text",
      { tags: [Tag.Smoke, Tag.Lines] },
      () => {
        lineDetailsPage.getEditLineButton().click();
        lineForm.getLabelInput().clearAndType(testInputs.newLabel);
        lineForm.getFinnishNameInput().clearAndType(testInputs.newName);
        lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
        lineForm.selectVehicleType('Bussi');
        lineForm.selectLineType('Peruslinja');
        lineForm.getLineTextInput().clearAndType('Muokattu linjateksti');

        lineForm.priorityForm.setAsDraft();
        lineForm.changeValidityForm.validityPeriodForm.setStartDate(
          '2022-01-01',
        );

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

        // Check line text from edit page
        lineDetailsPage.getEditLineButton().click();
        lineForm.getLineTextInput().should('have.text', 'Muokattu linjateksti');
        lineForm.cancel();
      },
    );

    it(
      'should show not valid for selected day text',
      { tags: [Tag.Smoke, Tag.Lines] },
      () => {
        lineDetailsPage.getEditLineButton().click();
        lineForm.changeValidityForm.validityPeriodForm.setStartDate(
          '2022-01-01',
        );
        lineForm.save();

        const beforeValidityPeriod = '2021-01-31';
        observationDateControl.setObservationDate(beforeValidityPeriod);
        cy.getByTestId('LineMissingBox::notValidText').should('be.visible');

        const withinValidityPeriod = '2022-01-01';
        observationDateControl.setObservationDate(withinValidityPeriod);
        cy.getByTestId('LineMissingBox::notValidText').should('not.exist');
      },
    );
  });
});
