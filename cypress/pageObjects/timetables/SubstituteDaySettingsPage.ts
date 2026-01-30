import { CommonSubstitutePeriodForm } from '../forms/CommonSubstitutePeriodForm';
import { ObservationPeriodForm } from '../forms/ObservationPeriodForm';
import { OccasionalSubstitutePeriodForm } from '../forms/OccasionalSubstitutePeriodForm';
import { Toast } from '../shared-components/Toast';

export class SubstituteDaySettingsPage {
  static occasionalSubstitutePeriodForm = OccasionalSubstitutePeriodForm;

  static observationPeriodForm = ObservationPeriodForm;

  static commonSubstitutePeriodForm = CommonSubstitutePeriodForm;

  static toast = Toast;

  static getLoadingCommonSubstitutePeriods() {
    return cy.getByTestId(
      'CommonSubstitutePeriodSection::loadingCommonSubstitutePeriods',
    );
  }

  static close() {
    cy.getByTestId('SubstituteDaySettingsPage::closeButton').click();
  }
}
