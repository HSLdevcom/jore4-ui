import { exportRoutesToHastus as exportToHastus } from '../../api/hastus';
import { RouteTableRowFragment } from '../../generated/graphql';
import {
  downloadFile,
  extractJourneyPatternFirstStop,
  extractJourneyPatternLastStop,
} from '../../utils';
import { useSearchQueryParser } from '../search';
import { useObservationDateQueryParam } from '../urlQuery';

export const useExportRoutes = () => {
  const { observationDate } = useObservationDateQueryParam();
  const { search } = useSearchQueryParser();

  const { priorities } = search;

  // Routes can be exported to Hastus only when there is only 1 priority selected
  // TODO: this will be reworked to not be dependant on search criteria
  const canExport = priorities?.length === 1;

  const hasFirstAndLastStopSetAsTimingPoint = (
    route: Pick<RouteTableRowFragment, 'route_journey_patterns'>,
  ): boolean => {
    const isEligibleJourneyPatterns = route.route_journey_patterns.map((jp) => {
      const firstStop = extractJourneyPatternFirstStop<{
        is_used_as_timing_point: boolean;
      }>(jp);
      const lastStop = extractJourneyPatternLastStop<{
        is_used_as_timing_point: boolean;
      }>(jp);
      return (
        firstStop.is_used_as_timing_point && lastStop.is_used_as_timing_point
      );
    });

    return isEligibleJourneyPatterns.some((eligible) => eligible);
  };

  /**
   * Checks if routes are eligible for export. All routes should have their first
   * and last stop set as timing point for it to be eligible for export. Returns
   * all routes uniqueLabel and direction which are not eligible.
   */
  const findNotEligibleRoutesForExport = (
    routesToExport: Pick<
      RouteTableRowFragment,
      'unique_label' | 'direction' | 'route_journey_patterns'
    >[],
  ): string[] => {
    const notEligibleRoutes: string[] = [];
    routesToExport.forEach((route) => {
      if (!hasFirstAndLastStopSetAsTimingPoint(route)) {
        const uniqueLabelAndDirection = `${route.unique_label} (${route.direction})`;
        notEligibleRoutes.push(uniqueLabelAndDirection);
      }
    });

    return notEligibleRoutes;
  };

  const exportRoutesToHastus = async (routeLabels: string[]) => {
    if (!canExport) {
      throw new Error(
        `Can't export routes, expected exactly 1 priority but got "${priorities}"`,
      );
    }

    const response = await exportToHastus({
      uniqueLabels: routeLabels,
      priority: priorities[0],
      observationDate,
    });

    downloadFile(
      response.data,
      `jore4-export-${observationDate.toISODate()}.csv`,
    );
  };

  return {
    canExport,
    exportRoutesToHastus,
    findNotEligibleRoutesForExport,
  };
};
