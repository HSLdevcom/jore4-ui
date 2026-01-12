import { Switch as HuiSwitch } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForwardRefRenderFunction, forwardRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import {
  selectEditedRouteData,
  selectMapRouteEditor,
  setTemplateRouteIdAction,
} from '../../../redux';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { ChangeValidityForm, FormColumn, FormRow, InputField } from '../common';
import { useDirtyFormBlockNavigation } from '../common/NavigationBlocker';
import { ChooseLineDropdown } from './ChooseLineDropdown';
import { DirectionDropdown } from './DirectionDropdown';
import {
  RouteFormState as FormState,
  routeFormSchema,
} from './RoutePropertiesForm.types';
import { TemplateRouteSelector } from './TemplateRouteSelector';
import { TerminusNameInputs } from './TerminusNameInputs';

export type RoutePropertiesFormProps = {
  readonly id?: string;
  readonly routeLabel?: string | null;
  readonly className?: string;
  readonly defaultValues: Partial<FormState>;
  readonly onSubmit: (state: FormState) => void;
};

const testIds = {
  directionDropdown: 'RoutePropertiesFormComponent::directionDropdown',
  lineChoiceDropdown: 'RoutePropertiesFormComponent::chooseLineDropdown',
  label: 'RoutePropertiesFormComponent::label',
  finnishName: 'RoutePropertiesFormComponent::finnishName',
  variant: 'RoutePropertiesFormComponent::variant',
  useTemplateRouteButton:
    'RoutePropertiesFormComponent::useTemplateRouteButton',
};

export const RoutePropertiesFormComponent: ForwardRefRenderFunction<
  HTMLFormElement,
  RoutePropertiesFormProps
> = ({ id, routeLabel, className, defaultValues, onSubmit }, ref) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { creatingNewRoute } = useAppSelector(selectMapRouteEditor);
  const { templateRouteId } = useAppSelector(selectEditedRouteData);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(routeFormSchema),
  });
  useDirtyFormBlockNavigation(methods.formState, 'RoutePropertiesForm', {
    allowSearchChange: true, // Allow search change so that moving the map does not show the navigation blocked dialog
    allowStateChange: true, // Allow state change so that location state updates do not show the navigation blocked dialog
  });

  const [showTemplateRouteSelector, setShowTemplateRouteSelector] =
    useState(false);

  const { handleSubmit } = methods;

  const setTemplateRoute = (uuid?: UUID) => {
    dispatch(setTemplateRouteIdAction(uuid));
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <FormProvider {...methods}>
      <form
        id={id ?? 'route-properties-form'}
        className={twMerge('space-y-6', className)}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {routeLabel && (
          <Row>
            <h2 className="mb-8">
              {t('routes.route')} {routeLabel}
            </h2>
          </Row>
        )}
        <FormColumn className={twMerge('p-4', className)}>
          <FormRow
            className="sm:gap-x-4 md:gap-x-4 lg:gap-x-4"
            mdColumns={5}
            smColumns={4}
          >
            <InputField<FormState>
              type="text"
              translationPrefix="routes"
              fieldPath="finnishName"
              testId={testIds.finnishName}
              className="sm:col-span-3"
            />
            <InputField<FormState>
              type="text"
              translationPrefix="routes"
              fieldPath="label"
              testId={testIds.label}
              className="col-span-1"
            />
            <InputField<FormState>
              type="number"
              translationPrefix="routes"
              fieldPath="variant"
              testId={testIds.variant}
              className="col-span-1"
              min={0}
            />
            <InputField<FormState>
              translationPrefix="routes"
              fieldPath="direction"
              testId={testIds.directionDropdown}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <DirectionDropdown
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
              className="col-span-2"
            />
            <InputField<FormState>
              translationPrefix="routes"
              fieldPath="onLineId"
              testId={testIds.lineChoiceDropdown}
              // eslint-disable-next-line react/no-unstable-nested-components
              inputElementRenderer={(props) => (
                <ChooseLineDropdown
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
              className="sm:col-span-3"
            />
          </FormRow>
        </FormColumn>
        <TerminusNameInputs />
        {creatingNewRoute && (
          <>
            <Row className="flex-auto items-center px-4">
              <HuiSwitch.Group>
                <SwitchLabel className="my-1 mr-2">
                  {t('routes.useTemplateRoute')}
                </SwitchLabel>
                <Switch
                  checked={showTemplateRouteSelector}
                  testId={testIds.useTemplateRouteButton}
                  onChange={(enabled: boolean) => {
                    setShowTemplateRouteSelector(enabled);

                    if (!enabled) {
                      setTemplateRoute(undefined);
                    }
                  }}
                />
              </HuiSwitch.Group>
            </Row>
            {showTemplateRouteSelector && (
              <TemplateRouteSelector
                value={templateRouteId}
                onChange={setTemplateRoute}
              />
            )}
          </>
        )}
        <FormRow className="border-t border-light-grey p-4">
          <ChangeValidityForm dateInputRowClassName="sm:gap-x-4 md:gap-x-4 lg:gap-x-4" />
        </FormRow>
      </form>
    </FormProvider>
  );
};

export const RoutePropertiesForm = forwardRef(RoutePropertiesFormComponent);
