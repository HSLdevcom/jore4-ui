import axios, { AxiosError } from 'axios';
import { DateTime } from 'luxon';
import {
  roleHeaderMap,
  userHasuraRole,
} from '../components/common/Apollo/auth';
import { Priority } from '../types/enums';

type CommonExportParams = {
  readonly uniqueLabels: ReadonlyArray<string>;
  readonly priority: Priority;
};

type ExportBody = CommonExportParams & {
  readonly observationDate: string;
};

type ExportParams = CommonExportParams & {
  readonly observationDate: DateTime;
};

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

function exportRoutes(payload: ExportBody) {
  return apiClient.post('/export/routes', payload, {
    responseType: 'blob',
    headers: roleHeaderMap(userHasuraRole),
  });
}

export function exportRoutesToHastus({
  uniqueLabels,
  priority,
  observationDate,
}: ExportParams) {
  return exportRoutes({
    uniqueLabels,
    priority,
    observationDate: observationDate.toISODate(),
  });
}

export async function getExportErrorBody(errorResponse: AxiosError) {
  // Since the response type is a "blob" (see exportRoutes above),
  // we need to parse the JSON out of error responses manually...
  // Note that the text() method is asynchronous.
  const blobBody = errorResponse.response?.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonText = (await (blobBody as any)?.text()) ?? '{}';
  return JSON.parse(jsonText);
}

export function getImportErrorBody(errorResponse: AxiosError) {
  return errorResponse?.response?.data;
}

export function sendFileToHastusImporter(file: File) {
  return apiClient.post('import', file, {
    headers: {
      ...roleHeaderMap(userHasuraRole),
      'Content-Type': 'text/csv;charset=iso-8859-1',
    },
  });
}

export function extractErrorType(
  errorResponseBody: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): HastusApiErrorType {
  const errorType = errorResponseBody?.type as keyof typeof HastusApiErrorType;
  const errorTypeEnum = HastusApiErrorType[errorType];

  return errorTypeEnum ?? HastusApiErrorType.UnknownError;
}
