import { Switch as HuiSwitch } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Row } from '../../../layoutComponents';
import { selectMapEditor, setTemplateRouteIdAction } from '../../../redux';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { FormColumn, FormRow, InputField } from '../common';
import { ConfirmSaveForm } from '../common/ConfirmSaveForm';
import { ChooseLineDropdown } from './ChooseLineDropdown';
import { DirectionDropdown } from './DirectionDropdown';
import {
  routeFormSchema,
  RouteFormState as FormState,
} from './RoutePropertiesForm.types';
import { TemplateRouteSelector } from './TemplateRouteSelector';
import { TerminusNameInputs } from './TerminusNameInputs';

export interface RouteFormProps {
  id?: string;
  routeLabel?: string | null;
  className?: string;
  defaultValues: Partial<FormState>;
  onSubmit: (state: FormState) => void;
}

const testIds = {
  directionDropdown: 'routePropertiesForm:direction-dropdown',
  lineChoiceDropdown: 'routePropertiesForm:choose-line-dropdown',
  label: 'routePropertiesForm:label',
  finnishName: 'routePropertiesForm:finnishName',
};

const RoutePropertiesFormComponent = (
  { id, routeLabel, className = '', defaultValues, onSubmit }: RouteFormProps,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { editedRouteData, creatingNewRoute } = useAppSelector(selectMapEditor);

  const methods = useForm<FormState>({
    defaultValues,
    resolver: zodResolver(routeFormSchema),
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
        id={id || 'route-properties-form'}
        className={className || ''}
        onSubmit={handleSubmit(onSubmit)}
        ref={ref}
      >
        {routeLabel && (
          <Row>
            <h2 className="mb-8 text-2xl font-bold">
              {t('routes.route')} {routeLabel}
            </h2>
          </Row>
        )}
        <FormColumn>
          <FormRow columns={3} className="sm:grid-cols-2">
            <InputField<FormState>
              type="text"
              translationPrefix="routes"
              fieldPath="finnishName"
              testId={testIds.finnishName}
              className="sm:col-span-2"
            />
            <InputField<FormState>
              type="text"
              translationPrefix="routes"
              fieldPath="label"
              testId={testIds.label}
              className="col-span-1"
            />
            <InputField<FormState>
              translationPrefix="routes"
              fieldPath="direction"
              testId={testIds.directionDropdown}
              inputElementRenderer={(props) => (
                <DirectionDropdown
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
              className="col-span-1"
            />
            <InputField<FormState>
              translationPrefix="routes"
              fieldPath="onLineId"
              testId={testIds.lineChoiceDropdown}
              inputElementRenderer={(props) => (
                <ChooseLineDropdown
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...props}
                />
              )}
              className="sm:col-span-2"
            />
          </FormRow>
        </FormColumn>
        <TerminusNameInputs />
        {creatingNewRoute && (
          <>
            <Row className="my-4 flex-auto items-center">
              <HuiSwitch.Group>
                <SwitchLabel className="my-1 mr-2">
                  {t('routes.useTemplateRoute')}
                </SwitchLabel>
                <Switch
                  checked={showTemplateRouteSelector}
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
                value={editedRouteData.templateRouteId}
                onChange={(e) => setTemplateRoute(e.target.value)}
              />
            )}
          </>
        )}
        <Row className="mt-7 border-t">
          <ConfirmSaveForm className="mt-5" />
        </Row>
      </form>
    </FormProvider>
  );
};

export const RoutePropertiesForm = React.forwardRef(
  RoutePropertiesFormComponent,
);
