import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { sendFileToHastusImporter } from '../../api/hastus';
import {
  useCombineTimetablesMutation,
  useDeleteStagingTimetablesMutation,
  useGetStagingVehicleScheduleFramesQuery,
  useReplaceTimetablesMutation,
} from '../../generated/graphql';
import { TimetablePriority } from '../../types/enums';
import {
  mapToVariables,
  showDangerToastWithError,
  showSuccessToast,
} from '../../utils';

const GQL_VEHICLE_JOURNEY_WITH_ROUTE_INFO_FRAGMENT = gql`
  fragment vehicle_journey_with_route_info on timetables_vehicle_journey_vehicle_journey {
    start_time
    end_time
    vehicle_journey_id
    journey_pattern_ref {
      journey_pattern_ref_id
      journey_pattern_instance {
        journey_pattern_id
        journey_pattern_route {
          ...route_default_fields
          direction
        }
      }
    }
    block {
      block_id
      vehicle_service {
        vehicle_service_id
        day_type {
          ...day_type_all_fields
        }
      }
    }
  }
`;

const GQL_VEHICLE_SERVICE_WITH_JOURNEYS_FRAGMENT = gql`
  fragment vehicle_service_with_journeys on timetables_vehicle_service_vehicle_service {
    vehicle_service_id
    name_i18n
    vehicle_schedule_frame {
      vehicle_schedule_frame_id
      priority
    }
    day_type {
      ...day_type_all_fields
    }
    blocks {
      block_id
      vehicle_journeys {
        ...vehicle_journey_with_route_info
      }
    }
  }
`;

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTE_INFO = gql`
  fragment vehicle_schedule_frame_with_route_info on timetables_vehicle_schedule_vehicle_schedule_frame {
    label
    validity_end
    validity_start
    name_i18n
    vehicle_schedule_frame_id
    priority
    vehicle_services {
      ...vehicle_service_with_journeys
    }
  }
`;

const GQL_GET_STAGING_VEHICLE_SCHEDULE_FRAMES = gql`
  query GetStagingVehicleScheduleFrames {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
      ) {
        ...vehicle_schedule_frame_with_route_info
      }
    }
  }
`;

const GQL_CHANGE_STAGING_VEHICLE_SCHEDULE_FRAME_PRIORITY = gql`
  mutation ChangeStagingVehicleScheduleFramePriority($newPriority: Int!) {
    timetables {
      timetables_update_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
        _set: { priority: $newPriority }
      ) {
        returning {
          priority
          validity_end
          validity_start
          name_i18n
          vehicle_schedule_frame_id
        }
      }
    }
  }
`;

const GQL_COMBINE_TIMETABLES = gql`
  mutation CombineTimetables(
    $stagingVehicleScheduleFrameIds: [uuid]!
    $targetPriority: Int!
  ) {
    combineTimetables(
      arg1: {
        stagingVehicleScheduleFrameIds: $stagingVehicleScheduleFrameIds
        targetPriority: $targetPriority
      }
    ) {
      combinedIntoVehicleScheduleFrameIds
    }
  }
`;

const GQL_REPLACE_TIMETABLES = gql`
  mutation ReplaceTimetables(
    $stagingVehicleScheduleFrameIds: [uuid]!
    $targetPriority: Int!
  ) {
    replaceTimetables(
      arg1: {
        stagingVehicleScheduleFrameIds: $stagingVehicleScheduleFrameIds
        targetPriority: $targetPriority
      }
    ) {
      replacedVehicleScheduleFrameIds
    }
  }
`;

const GQL_DELETE_STAGING_TIMETABLES = gql`
  mutation DeleteStagingTimetables($stagingVehicleScheduleFrameIds: [uuid!]) {
    timetables {
      timetables_delete_vehicle_schedule_vehicle_schedule_frame(
        where: {
          _and: {
            priority: { _eq: 40 }
            vehicle_schedule_frame_id: { _in: $stagingVehicleScheduleFrameIds }
          }
        }
      ) {
        returning {
          vehicle_schedule_frame_id
        }
      }
    }
  }
`;

export const useTimetablesImport = () => {
  const { t } = useTranslation();
  const [combineTimetables] = useCombineTimetablesMutation();
  const [replaceTimetables] = useReplaceTimetablesMutation();
  const [deleteStagingTimetables] = useDeleteStagingTimetablesMutation();

  const importedVehicleScheduleFramesResult =
    useGetStagingVehicleScheduleFramesQuery();

  const confirmTimetablesImportByCombining = async (
    stagingVehicleScheduleFrameIdsToCombine: UUID[],
    priority: TimetablePriority,
  ) => {
    await combineTimetables(
      mapToVariables({
        stagingVehicleScheduleFrameIds: stagingVehicleScheduleFrameIdsToCombine,
        targetPriority: priority,
      }),
    );
  };

  const confirmTimetablesImportByReplacing = async (
    stagingVehicleScheduleFrameIdsForReplace: UUID[],
    priority: TimetablePriority,
  ) => {
    await replaceTimetables(
      mapToVariables({
        stagingVehicleScheduleFrameIds:
          stagingVehicleScheduleFrameIdsForReplace,
        targetPriority: priority,
      }),
    );
  };

  const cancelTimetablesImport = async (stagingFrameIdsToDelete: UUID[]) => {
    // Note: this also deletes all the children of the staging frames, because of cascade delete.
    await deleteStagingTimetables(
      mapToVariables({
        stagingVehicleScheduleFrameIds: stagingFrameIdsToDelete,
      }),
    );
    // All staging frames have been deleted -> refetch them to update view.
    await importedVehicleScheduleFramesResult.refetch();
  };

  const vehicleScheduleFrames =
    importedVehicleScheduleFramesResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame || [];

  const vehicleJourneys =
    vehicleScheduleFrames
      ?.flatMap((frame) => frame.vehicle_services)
      .flatMap((service) => service.blocks)
      .flatMap((block) => block.vehicle_journeys) || [];

  /**
   * Sends list of files to hastus importer. They will be sent one by one and
   * a toast message will be shown in UI of the outcome.
   * Returns an object which has corresponding 'successfulFiles' and 'failedFiles'
   */
  const sendToHastusImporter = async (fileList: File[]) => {
    const failedFiles: File[] = [];
    const successfulFiles: File[] = [];
    // TODO: Currently sending multiple files at once fails. Only one will go through.
    // This might need changes to API as well, if we want to implement this.
    // Currently (27.3.2023), this is sufficient implementation for MVP
    await Promise.all(
      fileList.map(async (file) => {
        await sendFileToHastusImporter(file)
          .then(() => {
            successfulFiles.push(file);
            showSuccessToast(
              t('import.fileUploadSuccess', { filename: file.name }),
            );
          })
          .catch((error) => {
            failedFiles.push(file);
            showDangerToastWithError(
              t('import.fileUploadFailed', { filename: file.name }),
              error,
            );
          });
      }),
    );

    await importedVehicleScheduleFramesResult.refetch();

    return {
      successfulFiles,
      failedFiles,
    };
  };

  return {
    confirmTimetablesImportByCombining,
    confirmTimetablesImportByReplacing,
    cancelTimetablesImport,
    vehicleJourneys,
    vehicleScheduleFrames,
    sendToHastusImporter,
  };
};
