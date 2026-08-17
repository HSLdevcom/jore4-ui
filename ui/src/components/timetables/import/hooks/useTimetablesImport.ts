import { gql } from '@apollo/client';
import { AxiosError } from 'axios';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { sendFileToHastusImporter } from '../../../../api/hastus';
import {
  useCombineTimetablesMutation,
  useDeleteStagingTimetablesMutation,
  useGetStagingVehicleScheduleFramesQuery,
  useReplaceTimetablesMutation,
} from '../../../../generated/graphql';
import { Operation } from '../../../../redux';
import { TimetablePriority } from '../../../../types/enums';
import { showSuccessToast } from '../../../../utils';
import { useLoader } from '../../../common/hooks';

const GQL_VEHICLE_JOURNEY_WITH_ROUTE_INFO_FRAGMENT = gql`
  fragment VehicleJourneyWithRouteInfo on timetables_vehicle_journey_vehicle_journey {
    start_time
    end_time
    contract_number
    vehicle_journey_id
    journey_pattern_ref {
      journey_pattern_ref_id
      journey_pattern_instance {
        journey_pattern_id
        journey_pattern_route {
          ...RouteDefaultFields
          direction
        }
      }
    }
  }
`;

const GQL_VEHICLE_SERVICE_WITH_JOURNEYS_FRAGMENT = gql`
  fragment VehicleServiceWithJourneys on timetables_vehicle_service_vehicle_service {
    vehicle_service_id
    name_i18n
    day_type {
      ...DayTypeAllFields
    }
    blocks {
      block_id
      vehicle_journeys {
        ...VehicleJourneyWithRouteInfo
      }
      vehicle_type {
        vehicle_type_id
        description_i18n
      }
    }
  }
`;

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTE_INFO = gql`
  fragment VehicleScheduleFrameWithRouteInfo on timetables_vehicle_schedule_vehicle_schedule_frame {
    label
    validity_end
    validity_start
    name_i18n
    vehicle_schedule_frame_id
    priority
    vehicle_services {
      ...VehicleServiceWithJourneys
    }
  }
`;

const GQL_GET_STAGING_VEHICLE_SCHEDULE_FRAMES = gql`
  query GetStagingVehicleScheduleFrames {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: { priority: { _eq: 40 } }
      ) {
        ...VehicleScheduleFrameWithRouteInfo
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

export type HastusImportFailure = {
  file: File;
  error: AxiosError<{ reason: string }>;
};

export function useTimetablesImport() {
  const { t } = useTranslation();
  const [combineTimetables] = useCombineTimetablesMutation();
  const [replaceTimetables] = useReplaceTimetablesMutation();
  const [deleteStagingTimetables] = useDeleteStagingTimetablesMutation();

  const { setIsLoading: setIsUploadLoading } = useLoader(
    Operation.UploadFilesToHastusImport,
  );
  const { setIsLoading: setIsAbortLoading } = useLoader(Operation.AbortImport);

  const { setIsLoading: setIsImportLoading } = useLoader(
    Operation.ConfirmTimetablesImport,
  );

  const importedVehicleScheduleFramesResult =
    useGetStagingVehicleScheduleFramesQuery();

  const confirmTimetablesImportByCombining = async (
    stagingVehicleScheduleFrameIdsToCombine: ReadonlyArray<UUID>,
    priority: TimetablePriority,
  ) => {
    setIsImportLoading(true);
    await combineTimetables({
      variables: {
        stagingVehicleScheduleFrameIds: stagingVehicleScheduleFrameIdsToCombine,
        targetPriority: priority,
      },
    });

    await importedVehicleScheduleFramesResult.refetch();
    setIsImportLoading(false);
  };

  const confirmTimetablesImportByReplacing = async (
    stagingVehicleScheduleFrameIdsForReplace: ReadonlyArray<UUID>,
    priority: TimetablePriority,
  ) => {
    setIsImportLoading(true);
    await replaceTimetables({
      variables: {
        stagingVehicleScheduleFrameIds:
          stagingVehicleScheduleFrameIdsForReplace,
        targetPriority: priority,
      },
    });

    await importedVehicleScheduleFramesResult.refetch();
    setIsImportLoading(false);
  };

  const abortTimetablesImport = async (
    stagingFrameIdsToDelete: ReadonlyArray<UUID>,
  ) => {
    // Note: this also deletes all the children of the staging frames, because of cascade delete.
    setIsAbortLoading(true);
    await deleteStagingTimetables({
      variables: { stagingVehicleScheduleFrameIds: stagingFrameIdsToDelete },
    });
    // All staging frames have been deleted -> refetch them to update view.
    await importedVehicleScheduleFramesResult.refetch();
    setIsAbortLoading(false);
  };

  const vehicleScheduleFrames =
    importedVehicleScheduleFramesResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame ?? [];

  const vehicleJourneys =
    vehicleScheduleFrames
      ?.flatMap((frame) => frame.vehicle_services)
      .flatMap((service) => service.blocks)
      .flatMap((block) => block.vehicle_journeys) ?? [];

  /**
   * Sends list of files to hastus importer. They will be sent one by one and
   * a toast message will be shown in UI of the outcome.
   * Returns an object which has corresponding 'successfulFiles' and 'failedFiles'
   */
  const sendToHastusImporter = async (fileList: ReadonlyArray<File>) => {
    const failedFiles: HastusImportFailure[] = [];
    const successfulFiles: File[] = [];
    setIsUploadLoading(true);
    await Promise.all(
      fileList.map(async (file: File) => {
        await sendFileToHastusImporter(file)
          .then(() => {
            successfulFiles.push(file);
            showSuccessToast(
              t(($) => $.import.fileUploadSuccess, {
                filename: file.name,
              }),
            );
          })
          .catch((error) => {
            failedFiles.push({ file, error });
          });
      }),
    ).finally(() => {
      setIsUploadLoading(false);
    });

    await importedVehicleScheduleFramesResult.refetch();

    return {
      successfulFiles,
      failedFiles,
    };
  };

  const shouldBeSpecialDay = (vsf: {
    validity_start: DateTime;
    validity_end: DateTime;
  }) => {
    return (
      vsf.validity_start &&
      vsf.validity_end &&
      vsf.validity_start?.valueOf() === vsf.validity_end?.valueOf()
    );
  };
  const importingSomeSpecialDays =
    vehicleScheduleFrames.some(shouldBeSpecialDay);
  const importingOnlySpecialDays =
    vehicleScheduleFrames.every(shouldBeSpecialDay);
  const inconsistentSpecialDayPrioritiesStaged =
    importingSomeSpecialDays && !importingOnlySpecialDays;

  return {
    confirmTimetablesImportByCombining,
    confirmTimetablesImportByReplacing,
    abortTimetablesImport,
    vehicleJourneys,
    vehicleScheduleFrames,
    sendToHastusImporter,
    importingSomeSpecialDays,
    inconsistentSpecialDayPrioritiesStaged,
  };
}
