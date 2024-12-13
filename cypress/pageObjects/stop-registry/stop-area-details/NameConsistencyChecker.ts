export class NameConsistencyChecker {
  getLoader() {
    return cy.getByTestId('NameConsistencyChecker::loading');
  }

  getIsInconsistentTextField() {
    return cy.getByTestId('NameConsistencyChecker::inconsistent');
  }

  assertIsInconsistent() {
    this.getLoader().should('not.exist');
    this.getIsInconsistentTextField().shouldHaveText(
      'Muista nimetä jäsenpysäkit pysäkkialueen nimellä.',
    );
  }

  assertIsConsistent() {
    this.getLoader().should('not.exist');
    this.getIsInconsistentTextField().should('not.exist');
  }
}
