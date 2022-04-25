import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useParams } from 'react-router-dom';
import {
  RouteRoute,
  useGetRouteDetailsByIdsQuery,
} from '../../../generated/graphql';
import { mapRouteDetailsResult } from '../../../graphql';
import { useDeleteRoute, useEditRouteMetadata } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { mapToISODate } from '../../../time';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  ConfirmationDialog,
  FormContainer,
  SimpleButton,
} from '../../../uiComponents';
import {
  defaultLocalizedString,
  mapToVariables,
  showSuccessToast,
  submitFormByRef,
} from '../../../utils';
import { RoutePropertiesForm } from '../../forms/route/RoutePropertiesForm';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';
import {
  ConflictResolverModal,
  mapRouteToCommonConflictItem,
} from '../common/ConflictResolverModal';
import { PageHeader } from '../common/PageHeader';

const mapRouteToFormState = (route: RouteRoute): RouteFormState => ({
  finnishName: route.name_i18n?.fi_FI || '',
  label: route.label,
  on_line_id: route.on_line_id,
  direction: route.direction as RouteDirection,
  priority: route.priority,
  validityStart: mapToISODate(route.validity_start) || '',
  validityEnd: mapToISODate(route?.validity_end) || '',
  indefinite: !route?.validity_end,
  origin: {
    name: defaultLocalizedString(route.origin_name_i18n),
    shortName: defaultLocalizedString(route.origin_short_name_i18n),
  },
  destination: {
    name: defaultLocalizedString(route.destination_name_i18n),
    shortName: defaultLocalizedString(route.destination_short_name_i18n),
  },
});

export const EditRoutePage = (): JSX.Element => {
  const [hasFinishedEditing, setHasFinishedEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    prepareEditMetadata,
    mapEditMetadataChangesToVariables,
    editRouteMetadataMutation,
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
  const route = mapRouteDetailsResult(routeDetailsResult);
  const { t } = useTranslation();

  const onSave = () => {
    submitFormByRef(formRef);
  };

  const onCancel = () => {
    setHasFinishedEditing(true);
  };

  const onSubmit = async (form: RouteFormState) => {
    try {
      const changes = await prepareEditMetadata({ routeId: id, form });
      if (changes.conflicts?.length) {
        setConflicts(changes.conflicts);
        return;
      }
      const variables = mapEditMetadataChangesToVariables(changes);
      await editRouteMetadataMutation({ variables });
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
      <Redirect
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
        <i className="icon-bus-alt text-5xl text-tweaked-brand" />
        <h1 className="text-5xl font-bold">
          {t('lines.line', { label: route?.route_line?.label || '' })}
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
                defaultValues={mapRouteToFormState(route)}
                onSubmit={onSubmit}
              />
            )}
          </FormContainer>
        </Row>
        <Row className="mt-8">
          <SimpleButton
            id="delete-button"
            className="ml-auto"
            onClick={() => setIsDeleting(true)}
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
