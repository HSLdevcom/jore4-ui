import { AxiosError } from 'axios';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  exportRoutesToHastus as exportToHastus,
  extractErrorType,
  getExportErrorBody,
} from '../../../../api/hastus';
import { RouteTableRowFragment } from '../../../../generated/graphql';
import { useObservationDateQueryParam } from '../../../../hooks';
import {
  Operation,
  openSingleErrorModalAction,
  useLoader,
} from '../../../../redux';
import {
  mapHastusErrorTypeToErrorMessage,
  mapPriorityToUiName,
} from '../../../../utils/i18n';
import { useSearchQueryParser } from './useSearchQueryParser';

type JourneyPatternWithGenericReturnType<TType> = {
  scheduled_stop_point_in_journey_patterns: ReadonlyArray<
    TType & {
      scheduled_stop_point_sequence: number;
    }
  >;
};

/**
 * Extracts the first stop of journey pattern with the given TType typing
 */
function extractJourneyPatternFirstStop<TType>(
  journeyPattern: JourneyPatternWithGenericReturnType<TType>,
) {
  return minBy(
    journeyPattern.scheduled_stop_point_in_journey_patterns,
    'scheduled_stop_point_sequence',
  );
}

/**
 * Extracts the last stop of journey pattern with the given TType typing
 */
function extractJourneyPatternLastStop<TType>(
  journeyPattern: JourneyPatternWithGenericReturnType<TType>,
) {
  return maxBy(
    journeyPattern.scheduled_stop_point_in_journey_patterns,
    'scheduled_stop_point_sequence',
  );
}

function downloadFile(data: Blob, fileName: string) {
  // File download hack from here:
  // https://stackoverflow.com/a/53230807

  // Create file link in browser's memory
  const href = URL.createObjectURL(data);

  // Create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  // Clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

function hasFirstAndLastStopSetAsTimingPoint(
  route: Pick<RouteTableRowFragment, 'route_journey_patterns'>,
): boolean {
  const isEligibleJourneyPatterns = route.route_journey_patterns.map((jp) => {
    const firstStop = extractJourneyPatternFirstStop<{
      is_used_as_timing_point: boolean;
    }>(jp);
    const lastStop = extractJourneyPatternLastStop<{
      is_used_as_timing_point: boolean;
    }>(jp);
    return (
      firstStop?.is_used_as_timing_point && lastStop?.is_used_as_timing_point
    );
  });

  return isEligibleJourneyPatterns.some((eligible) => eligible);
}

/**
 * Checks if routes are eligible for export. All routes should have their first
 * and last stop set as timing point for it to be eligible for export. Returns
 * all routes uniqueLabel and direction which are not eligible.
 */
export function findNotEligibleRoutesForExport(
  routesToExport: ReadonlyArray<
    Pick<
      RouteTableRowFragment,
      'unique_label' | 'direction' | 'route_journey_patterns'
    >
  >,
): Array<string> {
  return routesToExport
    .filter((route) => !hasFirstAndLastStopSetAsTimingPoint(route))
    .map((route) => `${route.unique_label} (${route.direction})`);
}

export function useExportRoutes() {
  const { observationDate } = useObservationDateQueryParam();
  const { search } = useSearchQueryParser();
  const { setIsLoading } = useLoader(Operation.ExportRoute);
  const dispatch = useDispatch();

  const { priorities } = search;
  const { t } = useTranslation();

  // Routes can be exported to Hastus only when there is only 1 priority selected
  // TODO: this will be reworked to not be dependant on search criteria
  const canExport = priorities?.length === 1;

  const exportRoutesToHastus = async (routeLabels: ReadonlyArray<string>) => {
    try {
      setIsLoading(true);

      const response = await exportToHastus({
        uniqueLabels: routeLabels,
        priority: priorities[0],
        observationDate,
      });

      const filename = `${routeLabels[0]}_${mapPriorityToUiName(
        t,
        priorities[0],
      )}_${observationDate.toISODate()}.csv`;

      downloadFile(response.data, filename);
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        throw error;
      }
      const errorResponseBody = await getExportErrorBody(error);

      dispatch(
        openSingleErrorModalAction({
          errorModalTitle: t(($) => $.export.hastusErrorTitle),
          errorDetails: {
            details: mapHastusErrorTypeToErrorMessage(
              t,
              extractErrorType(errorResponseBody),
            ),
            additionalDetails: errorResponseBody?.reason ?? '',
          },
        }),
      );
    }

    setIsLoading(false);
  };

  return {
    canExport,
    exportRoutesToHastus,
    findNotEligibleRoutesForExport,
  };
}
