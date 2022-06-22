import { ConfirmSaveForm, MapEditor, MapFooter, RoutePropertiesForm, TerminusNameInputs } from '../pageObjects';

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
  it('Creates new route as expected', { scrollBehavior: false }, () => {
    mapFooter.createRoute();

    const routeName = 'Testilinja 1';

    // Date input errenously inputs zoom out commands, these offset them
    mapEditor.zoomIn();
    mapEditor.zoomIn();
    mapEditor.zoomIn();

    routePropertiesForm.getLabelInput().type('T-Linja 1');
    routePropertiesForm.getFinnishNameInput().type(routeName);
    routePropertiesForm.selectDirection('1');
    routePropertiesForm.selectLine('65');

    // Force text inputs due to scrolling causing zoom out
    terminusNameInputs.getTerminusOriginFinnishNameInput().type("Lähtöpaikka", { force: true });
    terminusNameInputs.getTerminusOriginFinnishShortNameInput().type("LP", { force: true });
    terminusNameInputs.getTerminusOriginSwedishNameInput().type("Ursprung", { force: true });
    terminusNameInputs.getTerminusOriginSwedishShortNameInput().type("UP", { force: true });

    terminusNameInputs.getTerminusDestinationFinnishNameInput().type("Määränpää", { force: true });
    terminusNameInputs.getTerminusDestinationFinnishShortNameInput().type("MP", { force: true });
    terminusNameInputs.getTerminusDestinationSwedishNameInput().type("Ändstation", { force: true });
    terminusNameInputs.getTerminusDestinationSwedishShortNameInput().type("ÄS", { force: true });

    confirmSaveForm.setAsDraft(true);
    confirmSaveForm.setStartDate('2022-01-01', true);
    confirmSaveForm.getIndefiniteCheckbox().check();

    routePropertiesForm.save(true);

    mapEditor.clickAtPositionFromNthMapMarker(-10, 15, 1);
    mapEditor.clickAtPositionFromNthMapMarker(20, 15, 1);
    mapEditor.clickNthCreatedRectangle(1);

    cy.getByTestId('mapOverlayHeader').get('div').contains(routeName).should('exist');    
  });
});
