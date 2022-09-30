import {
  buildLine,
  LineInsertInput,
  ReusableComponentsVehicleModeEnum,
} from '@hsl/jore4-test-db-manager';
import { DateTime } from 'luxon';
import { ConfirmSaveForm, LineForm, LineDetailsPage } from '../pageObjects';
import { insertToDbHelper, removeFromDbHelper } from '../utils';

const testLine1 = {
  label: '1999',
  id: '9e800038-3fbb-11ed-b878-0242ac120002',
  newLabel: 'Muokattu label 1999',
  newName: 'Muokattu nimi Testilinja FI',
  newPriority: 'Luonnos',
};

const lines: LineInsertInput[] = [
  {
    ...buildLine({ label: testLine1.label }),
    line_id: testLine1.id,
    priority: 10,
    primary_vehicle_mode: ReusableComponentsVehicleModeEnum.Bus,
    validity_start: DateTime.fromISO('2020-05-02 23:11:32Z'),
    validity_end: DateTime.fromISO('2026-05-02 23:11:32Z'),
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
    lineDetailsPage.visit(testLine1.id);
  });
  afterEach(() => {
    deleteCreatedResources();
  });

  it("Edits a line's name, label, validity period and priority", () => {
    lineDetailsPage.editLine();
    lineForm.getLabelInput().clear().type(testLine1.newLabel);
    lineForm.getFinnishNameInput().clear().type(testLine1.newName);
    lineForm.selectTransportTarget('Helsingin sisäinen liikenne');
    lineForm.selectVehicleType('Bussi');
    lineForm.selectLineType('Peruslinja');

    confirmSaveForm.setAsDraft();
    confirmSaveForm.setStartDate('2022-01-01');

    lineForm.save();
    lineForm.checkLineSubmitSuccess();

    lineDetailsPage.getLineName().should('have.text', testLine1.newName);
    lineDetailsPage.getLineLabel().should('have.text', testLine1.newLabel);
    lineDetailsPage
      .getLinePriority()
      .should('have.text', testLine1.newPriority);
    lineDetailsPage.getLineValidityPeriod().should('have.text', '1.1.2022 - ');
  });
});
