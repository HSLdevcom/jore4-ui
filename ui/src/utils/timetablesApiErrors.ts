import { ApolloError } from '@apollo/client';

// These error types originate from timetables-api, see `HasuraErrorType` there.
const timetablesApiErrorTypes = <const>[
  'UnknownError',
  'ConflictingSchedulesError',
  'InvalidTargetPriorityError',
  'MultipleTargetFramesFoundError',
  'PassingTimeFirstArrivalTimeError',
  'PassingTimeLastDepartureTimeError',
  'PassingTimeNullError',
  'PassingTimeStopPointMatchingOrderError',
  'PassingTimesMixedJourneyPatternRefsError',
  'SequentialIntegrityError',
  'StagingVehicleScheduleFrameNotFoundError',
  'TargetPriorityParsingError',
  'TargetVehicleScheduleFrameNotFoundError',
  'TransactionSystemError',
];
export type TimetablesApiErrorType = (typeof timetablesApiErrorTypes)[number];

export const extractErrorType = (
  error: ApolloError,
): TimetablesApiErrorType => {
  const errorType = error?.graphQLErrors[0]?.extensions
    ?.type as TimetablesApiErrorType;

  return timetablesApiErrorTypes.includes(errorType)
    ? errorType
    : 'UnknownError';
};

export const extractRawSqlError = (error: ApolloError): string | null => {
  // See `TransactionSystemExtensions` in timetables API.
  const sqlErrorMessageExtension =
    error?.graphQLErrors[0]?.extensions?.sqlErrorMessage;

  return typeof sqlErrorMessageExtension === 'string'
    ? sqlErrorMessageExtension
    : null;
};
