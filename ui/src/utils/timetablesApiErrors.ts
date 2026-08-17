import { ApolloError } from '@apollo/client';

export enum TimetablesApiErrorType {
  UnknownError = 'UnknownError',
  ConflictingSchedulesError = 'ConflictingSchedulesError',
  InvalidTargetPriorityError = 'InvalidTargetPriorityError',
  MultipleTargetFramesFoundError = 'MultipleTargetFramesFoundError',
  PassingTimeFirstArrivalTimeError = 'PassingTimeFirstArrivalTimeError',
  PassingTimeLastDepartureTimeError = 'PassingTimeLastDepartureTimeError',
  PassingTimeNullError = 'PassingTimeNullError',
  PassingTimeStopPointMatchingOrderError = 'PassingTimeStopPointMatchingOrderError',
  PassingTimesMixedJourneyPatternRefsError = 'PassingTimesMixedJourneyPatternRefsError',
  SequentialIntegrityError = 'SequentialIntegrityError',
  StagingVehicleScheduleFrameNotFoundError = 'StagingVehicleScheduleFrameNotFoundError',
  TargetPriorityParsingError = 'TargetPriorityParsingError',
  TargetVehicleScheduleFrameNotFoundError = 'TargetVehicleScheduleFrameNotFoundError',
  TransactionSystemError = 'TransactionSystemError',
}

export function extractErrorType(error: ApolloError): TimetablesApiErrorType {
  const errorType = error?.graphQLErrors[0]?.extensions
    ?.type as keyof typeof TimetablesApiErrorType;
  const errorTypeEnum = TimetablesApiErrorType[errorType];

  return errorTypeEnum ?? TimetablesApiErrorType.UnknownError;
}

export function extractRawSqlError(error: ApolloError): string | null {
  // See `TransactionSystemExtensions` in timetables API.
  const sqlErrorMessageExtension =
    error?.graphQLErrors[0]?.extensions?.sqlErrorMessage;

  return typeof sqlErrorMessageExtension === 'string'
    ? sqlErrorMessageExtension
    : null;
}
