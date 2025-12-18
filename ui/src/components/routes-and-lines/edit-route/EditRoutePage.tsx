import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RouteDefaultFieldsFragment,
  ServicePatternScheduledStopPoint,
  useGetRouteDetailsByIdsQuery,
} from '../../../generated/graphql';
import { useRequiredParams } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import {
  ConfirmationDialog,
  FormContainer,
  SimpleButton,
} from '../../../uiComponents';
import {
  mapToVariables,
  showSuccessToast,
  submitFormByRef,
} from '../../../utils';
import { PageTitle } from '../../common';
import { RedirectWithQuery } from '../../common/RedirectWithQuery';
import { RouteDraftStopsConfirmationDialog } from '../../forms/route/RouteDraftStopsConfirmationDialog';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import { useDeleteRoute } from '../../map/routes/hooks/useDeleteRoute';
import {
  mapRouteToFormState,
  useEditRouteMetadata,
} from '../../map/routes/hooks/useEditRouteMetadata';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../common/ConflictResolverModal';
import { PageHeader } from '../common/PageHeader';
import { useEditRouteJourneyPattern } from './useEditRouteJourneyPattern';

const testIds = {
  saveButton: 'EditRoutePage::saveButton',
  cancelButton: 'EditRoutePage::cancelButton',
  deleteButton: 'EditRoutePage::deleteButton',
};

export const EditRoutePage: FC = () => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draftStops, setDraftStops] = useState<
    ReadonlyArray<ServicePatternScheduledStopPoint>
  >([]);
  const [routeFormData, setRouteFormData] = useState<RouteFormState | null>(
    null,
  );

  const {
    prepareEditRouteMetadata,
    findDraftStopsOnRoute,
    mapEditRouteMetadataChangesToVariables,
    editRouteMetadata,
    defaultErrorHandler,
  } = useEditRouteMetadata();
  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();
  const {
    prepareDeleteStopFromRoute,
    mapEditJourneyPatternChangesToVariables,
    updateRouteGeometryMutation,
  } = useEditRouteJourneyPattern();
  const [conflicts, setConflicts] = useState<
    ReadonlyArray<RouteDefaultFieldsFragment>
  >([]);
  const formRef = useRef<ExplicitAny>(null);
  const { id } = useRequiredParams<{ id: string }>();

  const routeDetailsResult = useGetRouteDetailsByIdsQuery({
    ...mapToVariables({ route_ids: [id] }),
  });
  const route = routeDetailsResult.data?.route_route?.[0] ?? undefined;
  const { t } = useTranslation();

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    setHasFinishedEditing(true);
  };

  const onSubmit = async (form: RouteFormState) => {
    try {
      const changes = await prepareEditRouteMetadata({ routeId: id, form });
      if (changes.conflicts?.length) {
        setConflicts(changes.conflicts);
        return;
      }
      const variables = mapEditRouteMetadataChangesToVariables(changes);
      await editRouteMetadata(variables);
      setHasFinishedEditing(true);
      setRouteFormData(null);
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  const onPrepareSubmit = async (form: RouteFormState) => {
    try {
      const draftStopsOnRoute = await findDraftStopsOnRoute({
        routeId: id,
        oldPriority: route?.priority,
        form,
      });
      if (draftStopsOnRoute.length > 0) {
        setRouteFormData(form);
        setDraftStops(draftStopsOnRoute);
        return;
      }
      onSubmit(form);
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  const onRemoveStopsFromRoute = async (form: RouteFormState) => {
    try {
      if (route) {
        const changes = prepareDeleteStopFromRoute({
          route,
          stopPointLabels: draftStops?.map((stop) => stop.label),
        });
        const variables = mapEditJourneyPatternChangesToVariables(changes);
        await updateRouteGeometryMutation(variables);
      }
      onSubmit(form);
    } catch (err) {
      defaultErrorHandler(err);
    }
  };

  const onDelete = async () => {
    try {
      await deleteRoute(route?.route_id);
      showSuccessToast(t('routes.deleteSuccess'));
      setHasFinishedEditing(true);
    } catch (err) {
      defaultDeleteErrorHandler(err);
    }
  };

  if (hasFinishedEditing) {
    // if route was successfully edited, redirect to its line's page
    return (
      <RedirectWithQuery
        to={{
          pathname: route
            ? routeDetails[Path.lineDetails].getLink(route?.on_line_id)
            : '404',
        }}
      />
    );
  }

  const pageTitleText = t('lines.line', {
    label: route?.route_line?.label ?? '',
  });

  return (
    <div>
      <PageHeader>
        <PageTitle.H1 titleText={pageTitleText}>
          <i className="icon-bus-alt text-tweaked-brand" />
          {pageTitleText}
        </PageTitle.H1>
      </PageHeader>
      <Container>
        <Row className="mt-10">
          <FormContainer className="w-full">
            {route && (
              <RoutePropertiesForm
                routeLabel={route.label}
                ref={formRef}
                className="mb-2 ml-2 p-6"
                defaultValues={mapRouteToFormState(route)}
                onSubmit={onPrepareSubmit}
              />
            )}
          </FormContainer>
        </Row>
        <Row className="mt-8 justify-end gap-5">
          <SimpleButton
            id="delete-button"
            onClick={() => setIsDeleting(true)}
            inverted
            testId={testIds.deleteButton}
          >
            {t('map.deleteRoute')}
          </SimpleButton>
          <SimpleButton
            id="cancel-button"
            onClick={onCancel}
            inverted
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            id="save-button"
            onClick={onSave}
            testId={testIds.saveButton}
          >
            {t('save')}
          </SimpleButton>
        </Row>
      </Container>
      <ConflictResolverModal
        onClose={() => setConflicts([])}
        conflicts={conflicts.map(mapRouteToCommonConflictItem)}
      />
      <ConfirmationDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={onDelete}
        title={t('confirmDeleteRouteDialog.title')}
        description={t('confirmDeleteRouteDialog.description')}
        confirmText={t('confirmDeleteRouteDialog.confirmText')}
        cancelText={t('cancel')}
      />
      <RouteDraftStopsConfirmationDialog
        isOpen={draftStops?.length > 0}
        onCancel={() => setDraftStops([])}
        onRemoveStops={() => {
          if (routeFormData) {
            onRemoveStopsFromRoute(routeFormData);
          }
        }}
        onConfirm={() => {
          if (routeFormData) {
            onSubmit(routeFormData);
          }
        }}
        routeLabel={route?.label}
        stopsLabelsToRemove={draftStops.map((stop) => stop.label)}
      />
    </div>
  );
};
