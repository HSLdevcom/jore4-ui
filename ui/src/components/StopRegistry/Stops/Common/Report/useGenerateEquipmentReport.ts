import { useApolloClient } from '@apollo/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResolveSearchResultNetexIdsDocument,
  ResolveSearchResultNetexIdsQuery,
  ResolveSearchResultNetexIdsQueryVariables,
} from '../../../../../generated/graphql';
import { filtersAndResultSelectionToQueryVariables } from '../../../Search/Common';
import { ResultSelection, StopSearchFilters } from '../../../Search/Types';
import {
  makeFetchWriteProgressControls,
  mapToInfoSpotReportData,
  parseIdPairs,
  promptForFileName,
  useFetchEnrichedStopsByIds,
} from './reportGeneration';
import { SectionedReport } from './SectionedReport';
import {
  ByAlreadyKnownIds,
  ByFiltersAndSelection,
  GenerateReport,
  OnProgress,
  OnQuaysProcessedProgress,
  QuayAndStopPlaceIds,
  ReportContext,
} from './types';

type ResolveQuayAndStopPlaceIdsFn = (
  options: ByAlreadyKnownIds | ByFiltersAndSelection,
) => Promise<ReadonlyArray<QuayAndStopPlaceIds>>;

/**
 * Resolve filters or preknown list of ids into proper Quay+StopPlace NetexID
 * pairs that can be used to fetch the proper details from Tiamat.
 */
function useResolveQuayAndStopPlaceIds(): ResolveQuayAndStopPlaceIdsFn {
  const apollo = useApolloClient();

  return useCallback(
    async (options) => {
      if ('alreadyKnownIds' in options) {
        return options.alreadyKnownIds;
      }

      const where = filtersAndResultSelectionToQueryVariables(
        options.filters,
        options.selection,
      );

      const results = await apollo.query<
        ResolveSearchResultNetexIdsQuery,
        ResolveSearchResultNetexIdsQueryVariables
      >({
        query: ResolveSearchResultNetexIdsDocument,
        fetchPolicy: 'network-only',
        variables: { where },

        // At this moment, Apollo does not handle AbortSignals gracefully.
        // Apollo itself does not have direct support for them, but the HTTP
        // link can pass through the signal to the underlying fetch call.
        // But Apollo also dedupes queries, so if we have 2 reports requesting
        // the same data through a different query, but with same variables,
        // both of those calls get aborted, even tough only one of them is
        // supposed to be. This developer tried to also circumvent this
        // deduping behaviour by including an extra UUID v4 variable in the
        // query, that would have marked each instance unique, but Apollo
        // discards any and all variables, not actually used within the query,
        // even if they are declared as nonnull: query A($uniq: String!)
        // Comment link tag: Apollo and Abort Signals.
        // context: { fetchOptions: { signal: abortSignal } },
      });

      // Apollo does not handle the cancellation gracefully and can return
      // garbled up result on absort signal.
      options.abortSignal.throwIfAborted();

      return parseIdPairs(results.data);
    },
    [apollo],
  );
}

function usePrepareDataForExport() {
  const resolveQuayAndStopPlaceIds = useResolveQuayAndStopPlaceIds();
  const fetchEnrichedStopsByIds = useFetchEnrichedStopsByIds();

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    abortSignal: AbortSignal,
    onAllStopsResolved: (count: number) => void,
    onQuaysLoadedProgress: OnQuaysProcessedProgress,
  ) => {
    const ids = await resolveQuayAndStopPlaceIds({
      filters,
      selection,
      abortSignal,
    });

    return fetchEnrichedStopsByIds(
      ids,
      abortSignal,
      onAllStopsResolved,
      onQuaysLoadedProgress,
    );
  };
}

export function useGenerateEquipmentReport(): GenerateReport {
  const { t } = useTranslation();
  const prepareDataForExport = usePrepareDataForExport();

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    filename: string,
    saveFileNamePrompt: string,
    abortSignal: AbortSignal,
    onProgress: OnProgress,
  ): Promise<string> => {
    const { onTotalCountResolved, onDataFetched, onDataWritten } =
      makeFetchWriteProgressControls(onProgress);

    const data = await prepareDataForExport(
      filters,
      selection,
      abortSignal,
      onTotalCountResolved,
      onDataFetched,
    );

    const context: ReportContext = { observationDate: filters.observationDate };
    using report = SectionedReport.equipmentReport(t, data, context);
    const download = await report.generate(abortSignal, onDataWritten);

    abortSignal.throwIfAborted();

    const actualFileName = promptForFileName(filename, saveFileNamePrompt);
    download(actualFileName);
    return actualFileName;
  };
}

export function useGenerateInfoSpotReport(): GenerateReport {
  const { t } = useTranslation();
  const prepareDataForExport = usePrepareDataForExport();

  return async (
    filters: StopSearchFilters,
    selection: ResultSelection,
    filename: string,
    saveFileNamePrompt: string,
    abortSignal: AbortSignal,
    onProgress: OnProgress,
  ): Promise<string> => {
    const { onTotalCountResolved, onDataFetched, onDataWritten } =
      makeFetchWriteProgressControls(onProgress);

    const data = await prepareDataForExport(
      filters,
      selection,
      abortSignal,
      onTotalCountResolved,
      onDataFetched,
    );
    const infoSpotReportData = mapToInfoSpotReportData(data);

    const context: ReportContext = { observationDate: filters.observationDate };
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
