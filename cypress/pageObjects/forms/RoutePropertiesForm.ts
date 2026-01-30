import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager/dist/CypressSpecExports';
import { MoveRouteEditHandleInfo, RouteEditor } from '../map/RouteEditor';
import { ChangeValidityForm } from './ChangeValidityForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import {
  TemplateRouteSelector,
  TemplateRouteSelectorInfo,
} from './TemplateRouteSelector';
import { TerminusNameInputs, TerminusValues } from './TerminusNameInputs';
import {
  ValidityPeriodForm,
  ValidityPeriodFormInfo,
} from './ValidityPeriodForm';

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
  static terminusNameInputs = TerminusNameInputs;

  static changeValidityForm = ChangeValidityForm;

  static priorityForm = PriorityForm;

  static templateRouteSelector = TemplateRouteSelector;

  static routeEditor = RouteEditor;

  static getForm() {
    return cy.get('#route-properties-form');
  }

  static getLabelInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::label');
  }

  static getFinnishNameInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::finnishName');
  }

  static getUseTemplateRouteButton() {
    return cy.getByTestId(
      'RoutePropertiesFormComponent::useTemplateRouteButton',
    );
  }

  static selectDirection(direction: RouteDirectionEnum) {
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

  static selectLine(name: string) {
    cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
    cy.get('[role="option"]').contains(name).click();
  }

  static fillRouteProperties(values: RouteFormInfo) {
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
      RoutePropertiesForm.getFinnishNameInput().clearAndType(
        values.finnishName,
      );
    }
    if (values.label) {
      RoutePropertiesForm.getLabelInput().clearAndType(values.label);
    }
    if (values.variant) {
      RoutePropertiesForm.getVariantInput().clearAndType(values.variant);
    }
    if (values.direction) {
      RoutePropertiesForm.selectDirection(values.direction);
    }
    if (values.line) {
      RoutePropertiesForm.selectLine(values.line);
    }

    TerminusNameInputs.fillTerminusNameInputsForm(
      values.origin ?? defaultTerminusOriginInput,
      values.destination ?? defaultTerminusDestinationInput,
    );

    if (values.priority) {
      PriorityForm.setPriority(values.priority);
    }

    if (values.templateRoute) {
      RoutePropertiesForm.getUseTemplateRouteButton().scrollIntoViewAndClick();
      TemplateRouteSelector.fillForm(
        values.templateRoute.templateRouteSelectorInfo,
      );
    }

    ValidityPeriodForm.fillForm(values);
  }

  static getVariantInput() {
    return cy.getByTestId('RoutePropertiesFormComponent::variant');
  }
}
