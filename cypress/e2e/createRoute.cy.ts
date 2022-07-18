import {
  ConfirmSaveForm,
  MapEditor,
  MapFooter,
  RoutePropertiesForm,
  TerminusNameInputs,
} from '../pageObjects';

const deleteRouteByLabel = (label: string) => {
  const query = 'DELETE FROM "route"."route" WHERE label=?';
  cy.task('executeRawDbQuery', { query, bindings: label });
};

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
        '/routes?mapOpen=true&lng=24.93021804533524&ltd=60.164074274478054&z=15',
      );
      mapEditor.waitForMapToLoad();
    });

    const testRouteLabel = 'T-reitti 1';
    beforeEach(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    after(() => {
      deleteRouteByLabel(testRouteLabel);
    });

    it(
      'Creates new route as expected',
      { scrollBehavior: 'bottom', defaultCommandTimeout: 10000 },
      () => {
        mapFooter.createRoute();

        const routeName = 'Testireitti 1';

        routePropertiesForm.fillRouteProperties({
          label: testRouteLabel,
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

        confirmSaveForm.setAsStandard();
        confirmSaveForm.setStartDate('2022-01-01');
        confirmSaveForm.setEndDate('2022-12-01');

        routePropertiesForm.save();

        mapEditor.clickAtPositionFromMapMarkerByTestId(-10, 25, 'H1234_10');
        mapEditor.clickAtPositionFromMapMarkerByTestId(25, 5, 'H1236_10');

        mapEditor.clickNthCreatedRectangle(1);
        mapFooter.save();
        mapFooter.checkSubmitSuccess();

        cy.getByTestId('RouteStopsOverlay:mapOverlayHeader')
          .get('div')
          .contains(routeName)
          .should('exist');
      },
    );
  });
}
