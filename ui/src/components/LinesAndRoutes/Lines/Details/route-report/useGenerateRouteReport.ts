import { useApolloClient } from '@apollo/client';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import {
  ResolveSearchResultNetexIdsDocument,
  ResolveSearchResultNetexIdsQuery,
  ResolveSearchResultNetexIdsQueryVariables,
  RouteWithInfrastructureLinksWithStopsAndJpsFragment,
} from '../../../../../generated/graphql';
import { useGetLocalizedTextFromDbBlob } from '../../../../../utils/i18n';
import { SectionedReport } from '../../../../stop-registry/stops/Common/report/SectionedReport';
import {
  QuayAndStopPlaceIds,
  ReportContext,
  ReportRouteContext,
} from '../../../../stop-registry/stops/Common/report/types';
import {
  makeFetchWriteProgressControls,
  mapToInfoSpotReportData,
  parseIdPairs,
  promptForFileName,
  useFetchEnrichedStopsByIds,
} from '../../../../stop-registry/stops/Common/report/useGenerateEquipmentReport';
import {
  getRouteJourneyPatternStops,
  orderIdPairsByQuayNetexIds,
  routeStopsToOrderedQuayNetexIds,
} from './routeReportStops';
import { GenerateRouteReport } from './types';

/**
 * Resolve ordered Quay NetexIDs into Quay + StopPlace NetexID pairs using the
 * stops database. Kept separate from the route/journey pattern query so the
 * scheduled stop point and quay lookups are never combined into one query.
 */
function useResolveIdPairsByQuayNetexIds() {
  const apollo = useApolloClient();

  return async (
    quayNetexIds: ReadonlyArray<string>,
    abortSignal: AbortSignal,
  ): Promise<ReadonlyArray<QuayAndStopPlaceIds>> => {
    if (quayNetexIds.length === 0) {
      return [];
    }

    const results = await apollo.query<
      ResolveSearchResultNetexIdsQuery,
      ResolveSearchResultNetexIdsQueryVariables
    >({
      query: ResolveSearchResultNetexIdsDocument,
      fetchPolicy: 'network-only',
      variables: { where: { netex_id: { _in: quayNetexIds } } },
    });

    abortSignal.throwIfAborted();

    return orderIdPairsByQuayNetexIds(quayNetexIds, parseIdPairs(results.data));
  };
}

type RouteExportInput = {
  readonly quayNetexIds: ReadonlyArray<string>;
  readonly routeContext: ReportRouteContext;
};

/**
 * Resolve the ordered Quay NetexIDs (in driving order) and the route context
 * for a route based export. All rows share the same route, so the route context
 * is constant for the whole report.
 */
function useResolveRouteExportInput() {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  return (
    route: RouteWithInfrastructureLinksWithStopsAndJpsFragment,
    observationDate: DateTime,
  ): RouteExportInput => {
    const stops = getRouteJourneyPatternStops(route, observationDate);
    const quayNetexIds = routeStopsToOrderedQuayNetexIds(stops);

    const routeContext: ReportRouteContext = {
      label: route.label,
      variant: route.variant ?? null,
      name: getLocalizedTextFromDbBlob(route.name_i18n),
      direction: route.direction,
    };

    return { quayNetexIds, routeContext };
  };
}

export function useGenerateRouteEquipmentReport(): GenerateRouteReport {
  const { t } = useTranslation();

  const fetchEnrichedStopsByIds = useFetchEnrichedStopsByIds();
  const resolveRouteExportInput = useResolveRouteExportInput();
  const resolveIdPairsByQuayNetexIds = useResolveIdPairsByQuayNetexIds();

  return async (
    route,
    observationDate,
    filename,
    saveFileNamePrompt,
    abortSignal,
    onProgress,
  ): Promise<string> => {
    const { onTotalCountResolved, onDataFetched, onDataWritten } =
      makeFetchWriteProgressControls(onProgress);

    const { quayNetexIds, routeContext } = resolveRouteExportInput(
      route,
      observationDate,
    );
    const ids = await resolveIdPairsByQuayNetexIds(quayNetexIds, abortSignal);

    const data = await fetchEnrichedStopsByIds(
      ids,
      abortSignal,
      onTotalCountResolved,
      onDataFetched,
    );

    const context: ReportContext = { observationDate, route: routeContext };
    using report = SectionedReport.equipmentReport(t, data, context);
    const download = await report.generate(abortSignal, onDataWritten);

    abortSignal.throwIfAborted();

    const actualFileName = promptForFileName(filename, saveFileNamePrompt);
    download(actualFileName);
    return actualFileName;
  };
}

export function useGenerateRouteInfoSpotReport(): GenerateRouteReport {
  const { t } = useTranslation();

  const fetchEnrichedStopsByIds = useFetchEnrichedStopsByIds();
  const resolveRouteExportInput = useResolveRouteExportInput();
  const resolveIdPairsByQuayNetexIds = useResolveIdPairsByQuayNetexIds();

  return async (
    route,
    observationDate,
    filename,
    saveFileNamePrompt,
    abortSignal,
    onProgress,
  ): Promise<string> => {
    const { onTotalCountResolved, onDataFetched, onDataWritten } =
      makeFetchWriteProgressControls(onProgress);

    const { quayNetexIds, routeContext } = resolveRouteExportInput(
      route,
      observationDate,
    );
    const ids = await resolveIdPairsByQuayNetexIds(quayNetexIds, abortSignal);

    const data = await fetchEnrichedStopsByIds(
      ids,
      abortSignal,
      onTotalCountResolved,
      onDataFetched,
    );
    const infoSpotReportData = mapToInfoSpotReportData(data);

    const context: ReportContext = { observationDate, route: routeContext };
    using report = SectionedReport.infoSpotReport(
      t,
      infoSpotReportData,
      context,
    );
    const download = await report.generate(abortSignal, onDataWritten);

    abortSignal.throwIfAborted();

    const actualFileName = promptForFileName(filename, saveFileNamePrompt);
    download(actualFileName);
    return actualFileName;
  };
}
