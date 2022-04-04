import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/RoutePropertiesForm.types';
import {
  PatchRouteMutationVariables,
  RouteRouteSetInput,
  usePatchRouteMutation,
} from '../../generated/graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  showDangerToastWithError,
} from '../../utils';

interface EditParams {
  routeId: UUID;
  form: RouteFormState;
}

interface EditChanges {
  routeId: UUID;
  patch: RouteRouteSetInput;
}

const mapFormToInput = (state: RouteFormState): RouteRouteSetInput => {
  const { label, priority, validityStart, validityEnd, indefinite } = state;
  const mutation: RouteRouteSetInput = {
    description_i18n: state.description_i18n,
    label,
    on_line_id: state.on_line_id,
    direction: state.direction,
    priority,
    validity_start: mapDateInputToValidityStart(validityStart),
    validity_end: mapDateInputToValidityEnd(validityEnd, indefinite),
  };
  return mutation;
};

export const useEditRoute = () => {
  const { t } = useTranslation();
  const [mutateFunction] = usePatchRouteMutation();

  const prepareEdit = async ({ routeId, form }: EditParams) => {
    const input = mapFormToInput(form);

    const changes: EditChanges = {
      routeId,
      patch: input,
    };

    return changes;
  };

  const mapEditChangesToVariables = (
    changes: EditChanges,
  ): PatchRouteMutationVariables => ({
    route_id: changes.routeId,
    object: changes.patch,
  });

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: unknown) => {
    showDangerToastWithError(t('errors.saveFailed'), err);
  };

  return {
    prepareEdit,
    mapEditChangesToVariables,
    editRouteMutation: mutateFunction,
    defaultErrorHandler,
  };
};
