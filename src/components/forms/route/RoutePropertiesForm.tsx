import { Switch as HuiSwitch } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useContext, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MapEditorContext } from '../../../context/MapEditor';
import { Column, Row } from '../../../layoutComponents';
import { Switch, SwitchLabel } from '../../../uiComponents';
import { ConfirmSaveForm } from '../common/ConfirmSaveForm';
import { ChooseLineDropdown } from './ChooseLineDropdown';
import { DirectionDropdown } from './DirectionDropdown';
import { routeFormSchema, RouteFormState } from './RoutePropertiesForm.types';
import { TemplateRouteSelector } from './TemplateRouteSelector';

export interface RouteFormProps {
  id?: string;
  routeLabel?: string | null;
  className?: string;
  defaultValues: Partial<RouteFormState>;
  onSubmit: (state: RouteFormState) => void;
}

const RoutePropertiesFormComponent = (
  { id, routeLabel, className, defaultValues, onSubmit }: RouteFormProps,
  ref: ExplicitAny,
): JSX.Element => {
  const { t } = useTranslation();
  const {
    state: { editedRouteData, creatingNewRoute },
    dispatch,
  } = useContext(MapEditorContext);

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
    dispatch({
      type: 'setState',
      payload: {
        editedRouteData: {
          ...editedRouteData,
          templateRouteId: uuid,
        },
      },
    });
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
            <label htmlFor="description_i18n">{t('routes.name')}</label>
            <input
              id="description_i18n"
              type="text"
              {...register('description_i18n', {})}
            />
            <p>
              {errors.description_i18n?.type === 'too_small' &&
                t('formValidation.required')}
            </p>
          </Column>
          <Column className="w-44 flex-auto">
            <label htmlFor="label">{t('routes.label')}</label>
            <input id="label" type="text" {...register('label', {})} />
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
            <label htmlFor="on_line_id">{t('routes.addToLine')}</label>
            <Controller
              name="on_line_id"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <ChooseLineDropdown
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <p>
              {errors.on_line_id?.type === 'invalid_type' &&
                t('formValidation.required')}
            </p>
          </Column>
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
