export function mockMapTileServerReponses() {
  // Provide a local copy of the actual data included in the index.json file.
  cy.intercept(
    'GET',
    'https://api.digitransit.fi/map/v3/hsl-vector-map/index.json*',
    {
      statusCode: 200,
      fixture: 'openMapTilesIndexResponse.json',
    },
  ).as('block-map-tiles-index.json');

  // Block actual tile loading with 404 response
  cy.intercept(
    'GET',
    'https://api.digitransit.fi/map/v3/hsl-vector-map/*/*/*.pbf',
    { statusCode: 404, body: 'Request blocked in tests!' },
  ).as('block-map-tiles-tile.pbf');

  // Map fonts seem to be missing too → 404
  cy.intercept('GET', 'https://hslstoragestatic.azureedge.net/mapfonts/*', {
    statusCode: 404,
    body: 'Request blocked in tests!',
  }).as('block-map-fonts');

  // Same for icons
  cy.intercept(
    'GET',
    'https://hslstoragekarttatuotanto.z6.web.core.windows.net/sprite.(json|png)',
    { statusCode: 404, body: 'Request blocked in tests!' },
  ).as('block-map-icons');
}
