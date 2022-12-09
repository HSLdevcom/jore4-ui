import { RouteDirectionEnum } from '@hsl/jore4-test-db-manager';
import {
  ChangeValidityForm,
  ChangeValidityFormInfo,
} from './ChangeValidityForm';
import { PriorityForm, PriorityFormInfo } from './PriorityForm';
import { MoveRouteEditHandleInfo, RouteEditor } from './RouteEditor';
import {
  TemplateRouteSelector,
  TemplateRouteSelectorInfo,
} from './TemplateRouteSelector';
import { TerminusNameInputs } from './TerminusNameInputs';

export interface RouteFormInfo
  extends ChangeValidityFormInfo,
    PriorityFormInfo {
  finnishName?: string;
  label?: string;
  direction?: RouteDirectionEnum;
  line?: string;
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
    cy.getByTestId('RoutePropertiesFormComponent::directionDropdown').click();

    switch (direction) {
      case RouteDirectionEnum.Inbound:
        cy.get('li').contains('2 - Keskustaan päin').click();
        break;
      case RouteDirectionEnum.Outbound:
        cy.get('li').contains('1 - Keskustasta pois').click();
        break;
      default:
        break;
    }
  }

  selectLine(name: string) {
    cy.getByTestId('RoutePropertiesFormComponent::chooseLineDropdown').click();
    cy.get('li').contains(name).click();
  }

  fillRouteProperties(values: RouteFormInfo) {
    if (values.finnishName) {
      this.getFinnishNameInput().clear().type(values.finnishName);
    }
    if (values.label) {
      this.getLabelInput().clear().type(values.label);
    }
    if (values.direction) {
      this.selectDirection(values.direction);
    }
    if (values.line) {
      this.selectLine(values.line);
    }

    this.terminusNameInputs.fillTerminusNameInputsForm(
      {
        finnishName: 'Lähtöpaikka',
        swedishName: 'Ursprung',
        finnishShortName: 'LP',
        swedishShortName: 'UP',
      },
      {
        finnishName: 'Määränpää',
        swedishName: 'Ändstation',
        finnishShortName: 'MP',
        swedishShortName: 'ÄS',
      },
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

    this.changeValidityForm.fillForm(values);
  }
}
