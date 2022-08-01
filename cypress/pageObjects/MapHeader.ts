export class MapHeader {
  close() {
    return cy.getByTestId('mapHeader::close').click();
  }
}
