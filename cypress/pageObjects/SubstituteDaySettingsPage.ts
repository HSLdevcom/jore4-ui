import { CommonSubstitutePeriodForm } from './CommonSubstitutePeriodForm';
import { ObservationPeriodForm } from './ObservationPeriodForm';
import { OccasionalSubstitutePeriodForm } from './OccasionalSubstitutePeriodForm';
import { Toast } from './Toast';

export class SubstituteDaySettingsPage {
  occasionalSubstitutePeriodForm = new OccasionalSubstitutePeriodForm();

  observationPeriodForm = new ObservationPeriodForm();

  commonSubstitutePeriodForm = new CommonSubstitutePeriodForm();

  toast = new Toast();

  getLoadingCommonSubstitutePeriods() {
    return cy.getByTestId(
      'CommonSubstitutePeriodSection::loadingCommonSubstitutePeriods',
    );
  }

  close = () => {
    cy.getByTestId('SubstituteDaySettingsPage::closeButton').click();
  };
}
