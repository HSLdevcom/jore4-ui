import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllStopAreas } from '../../components/stop-registry/stop-areas/stop-area-details/useGetStopAreaDetails';
import { MaintenanceDetailsFormState } from '../../components/stop-registry/stops/stop-details/maintenance/schema';
import {
  StopAreaDetailsMembersFragment,
  StopRegistryStopPlaceOrganisationRefInput,
  StopRegistryStopPlaceOrganisationRelationshipType,
  useUpdateStopPlaceMutation,
} from '../../generated/graphql';
import {
  getRequiredStopPlaceMutationProperties,
  notNullish,
  showDangerToast,
} from '../../utils';
import { StopWithDetails } from './useGetStopDetails';

type EditTiamatParams = {
  state: MaintenanceDetailsFormState;
  stop: StopWithDetails;
};

type Props = {
  stopDetails: StopWithDetails;
};

const useStopArea = (props: Props) => {
  const { areas } = useGetAllStopAreas();

  return useMemo(() => {
    const stopArea = areas.filter((area) =>
      area?.members?.some(
        (member) =>
          // eslint-disable-next-line no-underscore-dangle
          member?.__typename === 'stop_registry_StopPlace' &&
          member?.id === props.stopDetails.stop_place_ref,
      ),
    );

    return stopArea;
  }, [props.stopDetails, areas]);
};

export const useEditStopMaintenanceDetails = (stopDetails: StopWithDetails) => {
  const { t } = useTranslation();
  const [updateStopPlaceMutation] = useUpdateStopPlaceMutation();
  const stopArea = useStopArea({ stopDetails });

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
      ...getRequiredStopPlaceMutationProperties(stop.stop_place),
      id: stopPlaceId,
      organisations: selectedOrganisations,
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

  const updateStopOrganizations = async (
    member: StopAreaDetailsMembersFragment,
    maintenanceOrg: StopRegistryStopPlaceOrganisationRefInput | null,
  ) => {
    if (!member?.id) {
      return;
    }

    const unchangedOrgs =
      member.organisations
        ?.filter((org) => org?.relationshipType !== 'maintenance')
        .map((org) => ({
          relationshipType: org?.relationshipType,
          organisationRef: org?.organisationRef ?? '',
        })) ?? [];

    const updatedOrgs = [...unchangedOrgs, maintenanceOrg];

    await updateStopPlaceMutation({
      variables: {
        input: {
          id: member.id,
          organisations: updatedOrgs,
        },
      },
    });
  };

  const updateTiamatStopPlace = async (editParams: EditTiamatParams) => {
    const changesToTiamatDb = prepareEditForTiamatDb(editParams);

    // Update the main stop first
    await updateStopPlaceMutation({
      variables: {
        input: changesToTiamatDb.input,
      },
    });

    // Get other stops in the area
    const memberStops = (stopArea[0]?.members?.filter(
      // eslint-disable-next-line no-underscore-dangle
      (member) => member?.__typename === 'stop_registry_StopPlace',
    ) ?? []) as StopAreaDetailsMembersFragment[];

    const otherStops = memberStops.filter(
      (member) => member.id !== changesToTiamatDb.input.id,
    );

    // Get the new maintenance organization
    const newMaintenanceOrg =
      changesToTiamatDb.input.organisations.find(
        (org) => org.relationshipType === 'maintenance',
      ) ?? null;

    // Update all other stops
    await Promise.all(
      otherStops.map((member) =>
        updateStopOrganizations(member, newMaintenanceOrg),
      ),
    );
  };

  const saveStopMaintenanceDetails = async ({
    state,
    stop: currentStop,
  }: {
    state: MaintenanceDetailsFormState;
    stop: StopWithDetails;
  }) => {
    await updateTiamatStopPlace({
      state,
      stop: currentStop,
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
