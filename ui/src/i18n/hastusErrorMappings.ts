import { HastusApiErrorType } from '../api/hastus';
import { i18n } from '../i18n';

export const mapHastusErrorTypeToErrorMessage = (
  errorType: HastusApiErrorType,
): string => {
  switch (errorType) {
    case HastusApiErrorType.CannotFindJourneyPatternRefByRouteLabelAndDirectionError:
      return i18n.t(
        'hastusApiErrors.cannotFindJourneyPatternRefByRouteLabelAndDirectionError',
      );
    case HastusApiErrorType.CannotFindJourneyPatternRefByStopPointLabelsError:
      return i18n.t(
        'hastusApiErrors.cannotFindJourneyPatternRefByStopPointLabelsError',
      );
    case HastusApiErrorType.CannotFindJourneyPatternRefByTimingPlaceLabelsError:
      return i18n.t(
        'hastusApiErrors.cannotFindJourneyPatternRefByTimingPlaceLabelsError',
      );
    case HastusApiErrorType.ErrorWhileProcessingHastusDataError:
      return i18n.t('hastusApiErrors.errorWhileProcessingHastusDataError');
    case HastusApiErrorType.FirstStopNotTimingPointError:
      return i18n.t('hastusApiErrors.firstStopNotTimingPointError');
    case HastusApiErrorType.GraphQLAuthenticationFailedError:
      return i18n.t('hastusApiErrors.graphQLAuthenticationFailedError');
    case HastusApiErrorType.IllegalArgumentError:
      return i18n.t('hastusApiErrors.illegalArgumentError');
    case HastusApiErrorType.InvalidHastusDataError:
      return i18n.t('hastusApiErrors.invalidHastusDataError');
    case HastusApiErrorType.LastStopNotTimingPointError:
      return i18n.t('hastusApiErrors.lastStopNotTimingPointError');
    case HastusApiErrorType.TooFewStopPointsError:
      return i18n.t('hastusApiErrors.tooFewStopPointsError');
    case HastusApiErrorType.UnknownError:
    default:
      return i18n.t('hastusApiErrors.unknownError');
  }
};
