import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import { Maybe, useGetLineDetailsByIdLazyQuery } from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
} from '../../utils';

interface ValidityPeriodParams {
  validity_start?: Maybe<DateTime>;
  validity_end?: Maybe<DateTime>;
}

interface JourneyPattern {
  includedStopLabels: string[];
}

export const useValidateRoute = () => {
  const { t } = useTranslation();

  const [getLineById] = useGetLineDetailsByIdLazyQuery();

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
    if (
      !route.validity_start ||
      (line.validity_start && route.validity_start < line.validity_start)
    ) {
      throw new Error(t('routes.startNotInsideLineValidity'));
    }

    if (
      line.validity_end &&
      (!route.validity_end || route.validity_end > line.validity_end)
    ) {
      throw new Error(t('routes.endNotInsideLineValidity'));
    }
  };

  const checkIsRouteValidityStartIsBeforeEnd = (
    route: ValidityPeriodParams,
  ) => {
    if (
      route.validity_start &&
      route.validity_end &&
      route.validity_start > route.validity_end
    ) {
      throw new Error(t('routes.validityStartIsAfterEnd'));
    }
  };

  const validateMetadata = async (routeMetadata: RouteFormState) => {
    // Check route's validity period is inside line's validity period

    const lineResult = await getLineById({
      variables: {
        line_id: routeMetadata.onLineId,
      },
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
    checkIsRouteValidityStartIsBeforeEnd({
      validity_start: routeValidityStart,
      validity_end: routeValidityEnd,
    });
  };

  return {
    validateStopCount,
    validateJourneyPattern,
    validateMetadata,
    checkIsRouteValidityInsideLineValidity,
    checkIsRouteValidityStartIsBeforeEnd,
  };
};
