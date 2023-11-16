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

export const extractErrorType = (
  error: ApolloError,
): TimetablesApiErrorType => {
  const errorType = error?.graphQLErrors[0]?.extensions
    ?.type as keyof typeof TimetablesApiErrorType;
  const errorTypeEnum = TimetablesApiErrorType[errorType];

  return errorTypeEnum || TimetablesApiErrorType.UnknownError;
};
