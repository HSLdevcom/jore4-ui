export class DirectionBadge {
  getOutboundDirectionBadge() {
    return cy.getByTestId('DirectionBadge::outbound');
  }

  getInboundDirectionBadge() {
    return cy.getByTestId('DirectionBadge::inbound');
  }
}
