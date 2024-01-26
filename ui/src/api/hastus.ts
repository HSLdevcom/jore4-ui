import axios, { AxiosError } from 'axios';
import { DateTime } from 'luxon';
import { roleHeaderMap, userHasuraRole } from '../graphql/auth';
import { Priority } from '../types/enums';

interface CommonExportParams {
  readonly uniqueLabels: string[];
  readonly priority: Priority;
}

interface ExportBody extends CommonExportParams {
  readonly observationDate: string;
}

interface ExportParams extends CommonExportParams {
  readonly observationDate: DateTime;
}

// See fi.hsl.jore4.hastus.api.util.HastusApiErrorType enum in the jore4-hastus repository.
export enum HastusApiErrorType {
  CannotFindJourneyPatternRefByRouteLabelAndDirectionError = 'CannotFindJourneyPatternRefByRouteLabelAndDirectionError',
  CannotFindJourneyPatternRefByStopPointLabelsError = 'CannotFindJourneyPatternRefByStopPointLabelsError',
  CannotFindJourneyPatternRefByTimingPlaceLabelsError = 'CannotFindJourneyPatternRefByTimingPlaceLabelsError',
  ErrorWhileProcessingHastusDataError = 'ErrorWhileProcessingHastusDataError',
  FirstStopNotTimingPointError = 'FirstStopNotTimingPointError',
  LastStopNotTimingPointError = 'LastStopNotTimingPointError',
  GraphQLAuthenticationFailedError = 'GraphQLAuthenticationFailedError',
  IllegalArgumentError = 'IllegalArgumentError',
  InvalidHastusDataError = 'InvalidHastusDataError',
  TooFewStopPointsError = 'TooFewStopPointsError',
  UnknownError = 'UnknownError',
}

const apiClient = axios.create({
  baseURL: '/api/hastus',
});

const exportRoutes = (payload: ExportBody) =>
  apiClient.post('/export/routes', payload, {
    responseType: 'blob',
    headers: roleHeaderMap(userHasuraRole),
  });

export const exportRoutesToHastus = async ({
  uniqueLabels,
  priority,
  observationDate,
}: ExportParams) => {
  const request: ExportBody = {
    uniqueLabels,
    priority,
    observationDate: observationDate.toISODate(),
  };
  const response = await exportRoutes(request);

  return response;
};

export const sendFileToHastusImporter = (file: File) => {
  return apiClient.post('import', file, {
    headers: {
      ...roleHeaderMap(userHasuraRole),
      'Content-Type': 'text/csv;charset=iso-8859-1',
    },
  });
};

export const extractErrorType = (error: AxiosError): HastusApiErrorType => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorType = (error?.response?.data as any)
    ?.type as keyof typeof HastusApiErrorType;
  const errorTypeEnum = HastusApiErrorType[errorType];

  return errorTypeEnum || HastusApiErrorType.UnknownError;
};
