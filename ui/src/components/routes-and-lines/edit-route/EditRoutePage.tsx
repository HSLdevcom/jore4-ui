import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  RouteRoute,
  useGetRouteDetailsByIdsQuery,
} from '../../../generated/graphql';
import { mapRouteResultToRoute } from '../../../graphql';
import {
  mapRouteToFormState,
  useDeleteRoute,
  useEditRouteMetadata,
} from '../../../hooks';
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
import { RedirectWithQuery } from '../../common/RedirectWithQuery';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../common/ConflictResolverModal';
import { PageHeader } from '../common/PageHeader';

const testIds = {
  saveButton: 'EditRoutePage::saveButton',
  cancelButton: 'EditRoutePage::cancelButton',
  deleteButton: 'EditRoutePage::deleteButton',
};

export const EditRoutePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    prepareEditRouteMetadata,
    mapEditRouteMetadataChangesToVariables,
    editRouteMetadata,
    defaultErrorHandler,
  } = useEditRouteMetadata();
  const { deleteRoute, defaultErrorHandler: defaultDeleteErrorHandler } =
    useDeleteRoute();
  const [conflicts, setConflicts] = useState<RouteRoute[]>([]);
  const formRef = useRef<ExplicitAny>(null);
  const { id } = useParams<{ id: string }>();

  const routeDetailsResult = useGetRouteDetailsByIdsQuery({
    ...mapToVariables({ route_ids: [id] }),
  });
  const route = mapRouteResultToRoute(routeDetailsResult);
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

  return (
    <div>
      <PageHeader>
        <Row>
          <h1>
            <i className="icon-bus-alt text-tweaked-brand" />
            {t('lines.line', { label: route?.route_line?.label || '' })}
          </h1>
        </Row>
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
                onSubmit={onSubmit}
              />
            )}
          </FormContainer>
        </Row>
        <Row className="mt-8">
          <SimpleButton
            id="delete-button"
            containerClassName="ml-auto"
            onClick={() => setIsDeleting(true)}
            inverted
            testId={testIds.deleteButton}
          >
            {t('map.deleteRoute')}
          </SimpleButton>
          <SimpleButton
            id="cancel-button"
            containerClassName="ml-5"
            onClick={onCancel}
            inverted
            testId={testIds.cancelButton}
          >
            {t('cancel')}
          </SimpleButton>
          <SimpleButton
            id="save-button"
            containerClassName="ml-5"
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
    </div>
  );
};
