import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  Maybe,
  useGetLineDetailsByIdAsyncQuery,
} from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
} from '../../utils';

interface ValidityPeriodParams {
  // eslint-disable-next-line camelcase
  validity_start?: Maybe<DateTime>;
  // eslint-disable-next-line camelcase
  validity_end?: Maybe<DateTime>;
}

interface JourneyPattern {
  includedStopLabels: string[];
}

export const useValidateRoute = () => {
  const { t } = useTranslation();

  const [getLineById] = useGetLineDetailsByIdAsyncQuery();

  /**
   * Check that there are enoung stops on the route
   */
  const validateStopCount = (includedStopLabels: string[]) => {
    if (includedStopLabels.length < 2) {
      throw new Error(t('routes.tooFewStops'));
    }
  };

  const validateJourneyPattern = async (journeyPattern: JourneyPattern) => {
    validateStopCount(journeyPattern.includedStopLabels);
  };

  const checkIsRouteValidityInsideLineValidity = (
    route: ValidityPeriodParams,
    line: ValidityPeriodParams,
  ) => {
    const lineValidityStart = line?.validity_start?.startOf('day');
    const lineValidityEnd = line?.validity_end?.endOf('day');

    if (
      !route.validity_start ||
      (lineValidityStart && route.validity_start < lineValidityStart)
    ) {
      throw new Error(t('routes.startNotInsideLineValidity'));
    }

    if (
      lineValidityEnd &&
      (!route.validity_end || route.validity_end > lineValidityEnd)
    ) {
      throw new Error(t('routes.endNotInsideLineValidity'));
    }
  };

  const validateMetadata = async (routeMetadata: RouteFormState) => {
    // Check route's validity period is inside line's validity period

    const lineResult = await getLineById({
      line_id: routeMetadata.onLineId,
    });
    const line = mapLineDetailsResult(lineResult);

    const routeValidityStart = mapDateInputToValidityStart(
      routeMetadata.validityStart,
    );
    const routeValidityEnd = mapDateInputToValidityEnd(
      routeMetadata.validityEnd,
      routeMetadata.indefinite,
    );

    checkIsRouteValidityInsideLineValidity(
      { validity_start: routeValidityStart, validity_end: routeValidityEnd },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      line!,
    );
  };

  return {
    validateStopCount,
    validateJourneyPattern,
    validateMetadata,
    checkIsRouteValidityInsideLineValidity,
  };
};
