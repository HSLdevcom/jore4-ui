import { Priority } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { Tag } from '../enums';
import { LineDetailsPage, LineForm } from '../pageObjects';

describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let lineDetailsPage: LineDetailsPage;

  beforeEach(() => {
    cy.task('resetDbs');
    lineForm = new LineForm();
    lineDetailsPage = new LineDetailsPage();

    cy.setupTests();
    cy.mockLogin();
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
  });
});
