import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { RouteFormState } from '../../components/forms/route/RoutePropertiesForm.types';
import {
  GetLineDetailsByIdDocument,
  GetLineDetailsByIdQuery,
  GetLineDetailsByIdQueryVariables,
  GetStopsByIdsDocument,
  GetStopsByIdsQuery,
  GetStopsByIdsQueryVariables,
  RouteLine,
  RouteRoute,
} from '../../generated/graphql';
import { mapGetStopsResult, mapLineDetailsResult } from '../../graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
} from '../../utils';
import { useAsyncQuery } from '../useAsyncQuery';
import { RouteGeometry } from './types';
import { extractFirstAndLastStopFromStops } from './utils';

interface ValidityPeriodParams {
  // eslint-disable-next-line camelcase
  validity_start?: DateTime;
  // eslint-disable-next-line camelcase
  validity_end?: DateTime | null;
}

export const useValidateRoute = () => {
  const { t } = useTranslation();

  const [getStopsByIds] = useAsyncQuery<
    GetStopsByIdsQuery,
    GetStopsByIdsQueryVariables
  >(GetStopsByIdsDocument);

  const [getLineById] = useAsyncQuery<
    GetLineDetailsByIdQuery,
    GetLineDetailsByIdQueryVariables
  >(GetLineDetailsByIdDocument);

  /**
   * Check that there are enoung stops on the route
   */
  const validateStopCount = ({
    stopIdsWithinRoute,
    infraLinksAlongRoute,
  }: RouteGeometry) => {
    if (
      !infraLinksAlongRoute ||
      !stopIdsWithinRoute ||
      stopIdsWithinRoute.length < 2
    ) {
      throw new Error(t('routes.tooFewStops'));
    }
  };

  /**
   * Check that route's starting stop resides on starting infrastructure link
   * and route's final stop resides on final infrastructure link
   */
  const validateStartFinalStops = async ({
    stopIdsWithinRoute,
    infraLinksAlongRoute,
  }: RouteGeometry) => {
    const { startingStopId, finalStopId } =
      extractFirstAndLastStopFromStops(stopIdsWithinRoute);

    const stopsResult = await getStopsByIds({
      stopIds: [startingStopId, finalStopId],
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stops = mapGetStopsResult(stopsResult)!;

    const startingStop = stops[0];
    const finalStop = stops[1];

    const startingInfraLink = infraLinksAlongRoute[0];
    const finalInfraLink =
      infraLinksAlongRoute[infraLinksAlongRoute.length - 1];

    if (
      startingStop.located_on_infrastructure_link_id !==
      startingInfraLink.infrastructureLinkId
    ) {
      throw new Error(t('routes.startingStopNotOnStartingInfraLink'));
    }

    if (
      finalStop.located_on_infrastructure_link_id !==
      finalInfraLink.infrastructureLinkId
    ) {
      throw new Error(t('routes.finalStopNotOnFinalInfraLink'));
    }
  };

  const validateGeometry = async (routeGeometry: RouteGeometry) => {
    validateStopCount(routeGeometry);

    await validateStartFinalStops(routeGeometry);
  };

  const checkIsRouteValidityInsideLineValidity = (
    route: RouteRoute | ValidityPeriodParams,
    line: RouteLine,
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
      line_id: routeMetadata.on_line_id,
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

  return { validateGeometry, validateMetadata };
};
