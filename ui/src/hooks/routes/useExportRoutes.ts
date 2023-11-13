import { useTranslation } from 'react-i18next';
import { exportRoutesToHastus as exportToHastus } from '../../api/hastus';
import { RouteTableRowFragment } from '../../generated/graphql';
import { mapPriorityToUiName } from '../../i18n/uiNameMappings';
import {
  downloadFile,
  extractJourneyPatternFirstStop,
  extractJourneyPatternLastStop,
  showDangerToastWithError,
} from '../../utils';
import { useSearchQueryParser } from '../search';
import { useObservationDateQueryParam } from '../urlQuery';

export const useExportRoutes = () => {
  const { observationDate } = useObservationDateQueryParam();
  const { search } = useSearchQueryParser();

  const { priorities } = search;
  const { t } = useTranslation();

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
        firstStop?.is_used_as_timing_point && lastStop?.is_used_as_timing_point
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
    try {
      const response = await exportToHastus({
        uniqueLabels: routeLabels,
        priority: priorities[0],
        observationDate,
      });

      const filename = `${routeLabels[0]}_${mapPriorityToUiName(
        priorities[0],
      )}_${observationDate.toISODate()}.csv`;

      downloadFile(response.data, filename);
    } catch (error) {
      showDangerToastWithError(t('export.hastusErrorTitle'), error);
    }
  };

  return {
    canExport,
    exportRoutesToHastus,
    findNotEligibleRoutesForExport,
  };
};
