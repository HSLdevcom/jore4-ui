import { ConfirmSaveForm, LineForm } from '../pageObjects';

describe('Verify that creating new line works', () => {
  let lineForm: LineForm;
  let confirmSaveForm: ConfirmSaveForm;
  beforeEach(() => {
    lineForm = new LineForm();
    confirmSaveForm = new ConfirmSaveForm();
    cy.visit('/lines/create');
  });
  it('Creates new line as expected', () => {
    lineForm.getLabelInput(cy).type('7327');
    lineForm.getFinnishNameInput(cy).type('Testilinja');
    lineForm.selectTransportTarget(cy, 'Helsingin sisäinen liikenne');
    lineForm.selectVehicleType(cy, 'Juna');
    lineForm.selectLineType(cy, 'Peruslinja');

    confirmSaveForm.setAsDraft(cy);
    confirmSaveForm.setStartDate(cy, '2022-01-01');
    confirmSaveForm.setEndDate(cy, '2022-12-31');

    // TODO: save line and verify that it was saved
    // when db hadling withint tests is implemented
    // lineForm.save(cy);
    // verify that line was created
  });
});
