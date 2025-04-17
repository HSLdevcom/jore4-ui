import { TFunction } from 'i18next';
import { HastusApiErrorType } from '../api/hastus';

export const mapHastusErrorTypeToErrorMessage = (
  t: TFunction,
  errorType: HastusApiErrorType,
): string => {
  switch (errorType) {
    case HastusApiErrorType.CannotFindJourneyPatternRefByRouteLabelAndDirectionError:
      return t(
        'hastusApiErrors.cannotFindJourneyPatternRefByRouteLabelAndDirectionError',
      );
    case HastusApiErrorType.CannotFindJourneyPatternRefByStopPointLabelsError:
      return t(
        'hastusApiErrors.cannotFindJourneyPatternRefByStopPointLabelsError',
      );
    case HastusApiErrorType.CannotFindJourneyPatternRefByTimingPlaceLabelsError:
      return t(
        'hastusApiErrors.cannotFindJourneyPatternRefByTimingPlaceLabelsError',
      );
    case HastusApiErrorType.ErrorWhileProcessingHastusDataError:
      return t('hastusApiErrors.errorWhileProcessingHastusDataError');
    case HastusApiErrorType.FirstStopNotTimingPointError:
      return t('hastusApiErrors.firstStopNotTimingPointError');
    case HastusApiErrorType.GraphQLAuthenticationFailedError:
      return t('hastusApiErrors.graphQLAuthenticationFailedError');
    case HastusApiErrorType.IllegalArgumentError:
      return t('hastusApiErrors.illegalArgumentError');
    case HastusApiErrorType.InvalidHastusDataError:
      return t('hastusApiErrors.invalidHastusDataError');
    case HastusApiErrorType.LastStopNotTimingPointError:
      return t('hastusApiErrors.lastStopNotTimingPointError');
    case HastusApiErrorType.TooFewStopPointsError:
      return t('hastusApiErrors.tooFewStopPointsError');
    case HastusApiErrorType.UnknownError:
    default:
      return t('hastusApiErrors.unknownError');
  }
};
