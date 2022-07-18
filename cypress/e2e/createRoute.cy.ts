import {
  ConfirmSaveForm,
  MapEditor,
  MapFooter,
  RoutePropertiesForm,
  TerminusNameInputs,
} from '../pageObjects';

if (!Cypress.env('SKIP_MAP_TESTS')) {
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
      cy.visit(
        '/routes?mapOpen=true&lng=24.93021804533524&lat=60.164074274478054&z=15',
      );
      mapEditor.waitForMapToLoad();
    });
    it(
      'Creates new route as expected',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapFooter.createRoute();

        const routeName = 'Testilinja 1';

        routePropertiesForm.fillRouteProperties({
          label: 'T-linja 1',
          finnishName: routeName,
          direction: '1',
          line: '65',
        });

        terminusNameInputs.fillTerminusNameInputsForm(
          {
            finnishName: 'Lähtöpaikka',
            swedishName: 'Ursprung',
            finnishShortName: 'LP',
            swedishShortName: 'UP',
          },
          {
            finnishName: 'Määränpää',
            swedishName: 'Ändstation',
            finnishShortName: 'MP',
            swedishShortName: 'ÄS',
          },
        );

        confirmSaveForm.setAsDraft();
        confirmSaveForm.setStartDate('2022-01-01');
        confirmSaveForm.getIndefiniteCheckbox().check();

        routePropertiesForm.save();

        // wait until the route properties form is closed, otherwise the clicks are not registered for the map
        routePropertiesForm.getForm().should('not.exist');

        mapEditor.clickAtPositionFromNthMapMarker(-10, 30, 1);
        mapEditor.clickAtPositionFromNthMapMarker(35, 5, 3);
        mapEditor.clickNthSnappingPointHandle(1);

        cy.getByTestId('RouteStopsOverlay:mapOverlayHeader')
          .get('div')
          .contains(routeName)
          .should('exist');
      },
    );
  });
}
