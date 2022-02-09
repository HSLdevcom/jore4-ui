import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router-dom';
import {
  useDeleteRouteMutation,
  useGetRouteDetailsByIdQuery,
  usePatchRouteMutation,
} from '../../generated/graphql';
import { mapRouteDetailsResult } from '../../graphql/route';
import { Container, Row } from '../../layoutComponents';
import { Path, routes } from '../../routes'; // eslint-disable-line import/no-cycle
import { FormContainer, SimpleButton } from '../../uiComponents';
import {
  mapToObject,
  mapToVariables,
  showToast,
  submitFormByRef,
} from '../../utils';
import { FormState, RoutePropertiesForm } from '../forms/RoutePropertiesForm';
import { PageHeader } from './PageHeader';

export const EditRoutePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [patchRoute] = usePatchRouteMutation();
  const [deleteRoute] = useDeleteRouteMutation();
  const formRef = useRef<ExplicitAny>(null);

  const { id } = useParams<{ id: string }>();

  const routeDetailsResult = useGetRouteDetailsByIdQuery({
    ...mapToVariables({ route_id: id }),
  });
  const route = mapRouteDetailsResult(routeDetailsResult);
  const { t } = useTranslation();

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    setHasFinishedEditing(true);
  };

  const onSubmit = async (state: FormState) => {
    const { finnishName, label, onLineId } = state;

    const variables = {
      route_id: id,
      ...mapToObject({
        description_i18n: finnishName,
        label,
        on_line_id: onLineId,
      }),
    };

    try {
      // patch the route in the backend
      await patchRoute(mapToVariables(variables));

      showToast({ type: 'success', message: t('routes.saveSuccess') });

      setHasFinishedEditing(true);
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

  const onDelete = async () => {
    try {
      // delete the route from the backend
      await deleteRoute(mapToVariables({ route_id: route?.route_id }));

      showToast({ type: 'success', message: t('routes.deleteSuccess') });

      setHasFinishedEditing(true);
    } catch (err) {
      showToast({
        type: 'danger',
        message: `${t('errors.saveFailed')}, '${err}'`,
      });
    }
  };

  if (hasFinishedEditing) {
    // if route was successfully edited, redirect to its line's page
    return (
      <Redirect
        to={{ pathname: routes[Path.lineDetails].getLink(route?.on_line_id) }}
      />
    );
  }

  return (
    <div>
      <PageHeader>
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">
          {`${t('lines.line')} ${route?.route_line?.label || ''}`}
        </h1>
      </PageHeader>
      <Container>
        <Row className="mt-10">
          <FormContainer className="w-full">
            {route && (
              <RoutePropertiesForm
                routeLabel={route.label}
                ref={formRef}
                className="mb-2 ml-2 p-6"
                defaultValues={{
                  finnishName: route.description_i18n || '',
                  label: route.label,
                  onLineId: route.on_line_id,
                }}
                onSubmit={onSubmit}
              />
            )}
          </FormContainer>
        </Row>
        <Row className="mt-8">
          <SimpleButton
            id="delete-button"
            className="ml-auto"
            onClick={onDelete}
            inverted
          >
            {t('map.deleteRoute')}
          </SimpleButton>
          <SimpleButton
            id="cancel-button"
            className="ml-5"
            onClick={onCancel}
            inverted
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton id="save-button" className="ml-5" onClick={onSave}>
            {t('save')}
          </SimpleButton>
        </Row>
      </Container>
    </div>
  );
};
