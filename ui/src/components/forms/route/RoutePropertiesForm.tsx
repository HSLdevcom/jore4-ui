import { Switch as HuiSwitch } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Column, Row } from '../../../layoutComponents';
import { selectMapEditor, setTemplateRouteIdAction } from '../../../redux';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { ConfirmSaveForm } from '../common/ConfirmSaveForm';
import { ChooseLineDropdown } from './ChooseLineDropdown';
import { DirectionDropdown } from './DirectionDropdown';
import { routeFormSchema, RouteFormState } from './RoutePropertiesForm.types';
import { TemplateRouteSelector } from './TemplateRouteSelector';
import { TerminusNameInputs } from './TerminusNameInputs';

export interface RouteFormProps {
  id?: string;
  routeLabel?: string | null;
  className?: string;
  defaultValues: Partial<RouteFormState>;
  onSubmit: (state: RouteFormState) => void;
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

  const methods = useForm<RouteFormState>({
    defaultValues,
    resolver: zodResolver(routeFormSchema),
  });

  const [showTemplateRouteSelector, setShowTemplateRouteSelector] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

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
        <Row className="mb-5 flex-wrap gap-2">
          <Column className="w-80 flex-auto">
            <label htmlFor="finnishName">{t('routes.name')}</label>
            <input
              id="finnishName"
              data-testid={testIds.finnishName}
              type="text"
              {...register('finnishName', {})}
            />
            <p>
              {errors.finnishName?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-44 flex-auto">
            <label htmlFor="label">{t('routes.label')}</label>
            <input
              id="label"
              data-testid={testIds.label}
              type="text"
              {...register('label', {})}
            />
            <p>
              {errors.label?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-44 flex-auto">
            <label htmlFor="direction">{t('routes.direction')}</label>
            <Controller
              name="direction"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <DirectionDropdown
                  value={value}
                  testId={testIds.directionDropdown}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <p>
              {errors.direction?.type === 'invalid_enum_value' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-80 flex-auto">
            <label htmlFor="onLineId">{t('routes.addToLine')}</label>
            <Controller
              name="onLineId"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <ChooseLineDropdown
                  value={value}
                  testId={testIds.lineChoiceDropdown}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <p>
              {errors.onLineId?.type === 'invalid_type' &&
                t('formValidation.required')}
            </p>
          </Column>
          <TerminusNameInputs />
          {creatingNewRoute && (
            <>
              <Row className="flex-auto items-center">
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
        </Row>
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
