import { StopRegistryTransportModeType } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';

export class TransportationModeFilter {
  getCheckbox(mode: StopRegistryTransportModeType) {
    return cy.getByTestId(`StopSearchBar::transportationMode::${mode}`);
  }

  isSelected(mode: StopRegistryTransportModeType) {
    this.getCheckbox(mode).should('have.attr', 'aria-checked', 'true');
  }

  isNotSelected(mode: StopRegistryTransportModeType) {
    this.getCheckbox(mode).should('have.attr', 'aria-checked', 'false');
  }

  toggle(mode: StopRegistryTransportModeType) {
    this.getCheckbox(mode).click();
  }

  setSelected(mode: StopRegistryTransportModeType, isSelected: boolean) {
    this.getCheckbox(mode).then((checkBox) => {
      const checked = checkBox.attr('aria-checked') === 'true';
      if (checked !== isSelected) {
        this.toggle(mode);
      }
    });
  }
}
