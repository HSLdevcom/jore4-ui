import { useTranslation } from 'react-i18next';
import { MaintenanceDetailsFormState } from '../../components/stop-registry/stops/stop-details/maintenance/schema';
import {
  StopRegistryStopPlaceOrganisationRefInput,
  StopRegistryStopPlaceOrganisationRelationshipType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import { StopWithDetails } from '../../types';
import { notNullish, showDangerToast } from '../../utils';

type EditTiamatParams = {
  readonly state: MaintenanceDetailsFormState;
  readonly stop: StopWithDetails;
};

export const useEditStopMaintenanceDetails = () => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();

  const mapStopEditChangesToTiamatDbInput = ({
    state,
    stop,
  }: EditTiamatParams) => {
    const stopPlaceId = stop.stop_place?.id;

    const selectedOrganisations: Array<StopRegistryStopPlaceOrganisationRefInput> =
      Object.entries(state.maintainers)
        .map(([relationshipType, organisationId]) => {
          if (organisationId === null || organisationId === 'null') {
            return null;
          }

          return {
            organisationRef: organisationId,
            relationshipType:
              relationshipType as StopRegistryStopPlaceOrganisationRelationshipType,
          };
        })
        .filter(notNullish);

    const input = {
      id: stopPlaceId,
      organisations:
        selectedOrganisations.length > 0 ? selectedOrganisations : [null],
    };

    return input;
  };

  const prepareEditForTiamatDb = ({ state, stop }: EditTiamatParams) => {
    return {
      input: mapStopEditChangesToTiamatDbInput({
        state,
        stop,
      }),
    };
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);
    await updateStopPlaceMutation({
      variables: changesToTiamatDb,
    });
  };

  const saveStopMaintenanceDetails = async ({
    state,
    stop,
  }: {
    state: MaintenanceDetailsFormState;
    stop: StopWithDetails;
  }) => {
    await updateTiamatStopPlace({
      state,
      stop,
    });
  };

  // default handler that can be used to show error messages as toast
  // in case an exception is thrown
  const defaultErrorHandler = (err: Error) => {
    showDangerToast(`${t('errors.saveFailed')}, ${err}`);
  };

  return {
    saveStopMaintenanceDetails,
    defaultErrorHandler,
  };
};
