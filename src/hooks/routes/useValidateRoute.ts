import { useTranslation } from 'react-i18next';
import { useGetStopsByIdsAsyncQuery } from '../../generated/graphql';
import { mapGetStopsResult, RouteGeometry } from '../../graphql';
import { extractFirstAndLastStopFromStops } from './utils';

export const useValidateRoute = () => {
  const { t } = useTranslation();

  const [getStopsByIds] = useGetStopsByIdsAsyncQuery();

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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const startingStop = stops.find(
      (stop) => stop.scheduled_stop_point_id === startingStopId,
    )!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const finalStop = stops.find(
      (stop) => stop.scheduled_stop_point_id === finalStopId,
    )!;

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

  return { validateGeometry };
};
