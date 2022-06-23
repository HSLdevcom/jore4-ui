import {
  ConfirmSaveForm,
  MapEditor,
  MapFooter,
  RoutePropertiesForm,
  TerminusNameInputs,
} from '../pageObjects';

describe('Verify that creating new route works', () => {
  let mapEditor: MapEditor;
  let mapFooter: MapFooter;
  let routePropertiesForm: RoutePropertiesForm;
  let terminusNameInputs: TerminusNameInputs;
  let confirmSaveForm: ConfirmSaveForm;
  beforeEach(() => {
    mapEditor = new MapEditor();
    mapFooter = new MapFooter();
    routePropertiesForm = new RoutePropertiesForm();
    terminusNameInputs = new TerminusNameInputs();
    confirmSaveForm = new ConfirmSaveForm();
    cy.mockLogin();
    cy.visit('/routes?mapOpen=true');
  });
  it(
    'Creates new route as expected',
    { scrollBehavior: 'bottom', defaultCommandTimeout: 6000 },
    () => {
      mapFooter.createRoute();

      const routeName = 'Testilinja 1';

      routePropertiesForm.getLabelInput().type('T-Linja 1');
      routePropertiesForm.getFinnishNameInput().type(routeName);
      routePropertiesForm.selectDirection('1');
      routePropertiesForm.selectLine('65');

      // Force text inputs due to scrolling causing zoom out
      terminusNameInputs
        .getTerminusOriginFinnishNameInput()
        .type('Lähtöpaikka');
      terminusNameInputs.getTerminusOriginFinnishShortNameInput().type('LP');
      terminusNameInputs.getTerminusOriginSwedishNameInput().type('Ursprung');
      terminusNameInputs.getTerminusOriginSwedishShortNameInput().type('UP');

      terminusNameInputs
        .getTerminusDestinationFinnishNameInput()
        .type('Määränpää');
      terminusNameInputs
        .getTerminusDestinationFinnishShortNameInput()
        .type('MP');
      terminusNameInputs
        .getTerminusDestinationSwedishNameInput()
        .type('Ändstation');
      terminusNameInputs
        .getTerminusDestinationSwedishShortNameInput()
        .type('ÄS');

      confirmSaveForm.setAsDraft();
      confirmSaveForm.setStartDate('2022-01-01');
      confirmSaveForm.getIndefiniteCheckbox().check();

      routePropertiesForm.save();

      mapEditor.clickAtPositionFromNthMapMarker(-10, 25, 1);
      mapEditor.clickAtPositionFromNthMapMarker(25, 5, 1);
      mapEditor.clickNthCreatedRectangle(1);

      cy.getByTestId('mapOverlayHeader')
        .get('div')
        .contains(routeName)
        .should('exist');
    },
  );
});
