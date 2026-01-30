export class DirectionBadge {
  static getOutboundDirectionBadge() {
    return cy.getByTestId('DirectionBadge::outbound');
  }

  static getInboundDirectionBadge() {
    return cy.getByTestId('DirectionBadge::inbound');
  }
}
