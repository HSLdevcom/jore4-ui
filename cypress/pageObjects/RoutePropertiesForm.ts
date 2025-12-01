import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { ChangeValidityForm } from './ChangeValidityForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import { MoveRouteEditHandleInfo, RouteEditor } from './RouteEditor';
import {
  TemplateRouteSelector,
  TemplateRouteSelectorInfo,
} from './TemplateRouteSelector';
import { TerminusNameInputs, TerminusValues } from './TerminusNameInputs';
import { ValidityPeriodFormInfo } from './ValidityPeriodForm';

export interface RouteFormInfo
  extends ValidityPeriodFormInfo, PriorityFormInfo {
  finnishName?: string;
  label?: string;
  variant?: string;
  direction?: RouteDirectionEnum;
  line?: string;
  origin?: TerminusValues;
  destination?: TerminusValues;
  templateRoute?: {
    templateRouteSelectorInfo: TemplateRouteSelectorInfo;
    moveRouteEditHandleInfo?: MoveRouteEditHandleInfo;
  };
}

export class RoutePropertiesForm {
  terminusNameInputs = new TerminusNameInputs();

  changeValidityForm = new ChangeValidityForm();

  priorityForm = new PriorityForm();

  templateRouteSelector = new TemplateRouteSelector();

  routeEditor = new RouteEditor();

  getForm() {
    return cy.get('#route-properties-form');
  }

  getLabelInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::label');
  }

  getFinnishNameInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::finnishName');
  }

  getUseTemplateRouteButton() {
    return cy.getByTestId(
      'RoutePropertiesFormComponent::useTemplateRouteButton',
    );
  }

  selectDirection(direction: RouteDirectionEnum) {
    cy.getByTestId(
      'RoutePropertiesFormComponent::directionDropdown::ListboxButton',
    ).click();

    switch (direction) {
      case RouteDirectionEnum.Inbound:
        cy.get('[role="option"]').contains('2 - Keskustaan päin').click();
        break;
      case RouteDirectionEnum.Outbound:
        cy.get('[role="option"]').contains('1 - Keskustasta pois').click();
        break;
      default:
        break;
    }
  }

  selectLine(name: string) {
    cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
    cy.get('[role="option"]').contains(name).click();
  }

  fillRouteProperties(values: RouteFormInfo) {
    const defaultTerminusOriginInput = {
      finnishName: 'Lähtöpaikka',
      swedishName: 'Ursprung',
      finnishShortName: 'LP',
      swedishShortName: 'UP',
    };

    const defaultTerminusDestinationInput = {
      finnishName: 'Määränpää',
      swedishName: 'Ändstation',
      finnishShortName: 'MP',
      swedishShortName: 'ÄS',
    };

    if (values.finnishName) {
      this.getFinnishNameInput().clear().type(values.finnishName);
    }
    if (values.label) {
      this.getLabelInput().clear().type(values.label);
    }
    if (values.variant) {
      this.getVariantInput().clear().type(values.variant);
    }
    if (values.direction) {
      this.selectDirection(values.direction);
    }
    if (values.line) {
      this.selectLine(values.line);
    }

    this.terminusNameInputs.fillTerminusNameInputsForm(
      values.origin ?? defaultTerminusOriginInput,
      values.destination ?? defaultTerminusDestinationInput,
    );

    if (values.priority) {
      this.priorityForm.setPriority(values.priority);
    }

    if (values.templateRoute) {
      this.getUseTemplateRouteButton().click();
      this.templateRouteSelector.fillForm(
        values.templateRoute.templateRouteSelectorInfo,
      );
    }

    this.changeValidityForm.validityPeriodForm.fillForm(values);
  }

  getVariantInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::variant');
  }
}
