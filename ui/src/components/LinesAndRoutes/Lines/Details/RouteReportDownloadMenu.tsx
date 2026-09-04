import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../generated/graphql';
import { mapToShortDate, mapToShortTime } from '../../../../time';
import { mapDirectionToSymbol } from '../../../../utils/i18n';
import { SimpleDropdownMenu } from '../../../common/Dropdowns';
import {
  useGenerateRouteEquipmentReport,
  useGenerateRouteInfoSpotReport,
} from '../../../stop-registry/search/csv-export/useGenerateEquipmentReport';
import { RouteDownloadReportMenuItem } from './RouteDownloadReportMenuItem';

const testIds = {
  menu: 'RouteReportDownloadMenu::menu',
  equipmentReport: 'RouteEquipmentReport',
  infoSpotReport: 'RouteInfoSpotReport',
};

type RouteReportDownloadMenuProps = {
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly observationDate: DateTime;
  readonly className?: string;
};

export const RouteReportDownloadMenu: FC<RouteReportDownloadMenuProps> = ({
  route,
  observationDate,
  className,
}) => {
  const { t } = useTranslation();

  const generateEquipmentReport = useGenerateRouteEquipmentReport();
  const generateInfoSpotReport = useGenerateRouteInfoSpotReport();

  const routeIdentifier = `${route.label} ${mapDirectionToSymbol(t, route.direction)}`;

  return (
    <SimpleDropdownMenu
      className={className}
      icon="icon-download"
      testId={testIds.menu}
      tooltip={t(($) => $.stopRegistrySearch.csv.routeReport.downloadTooltip)}
    >
      <RouteDownloadReportMenuItem
        route={route}
        observationDate={observationDate}
        generateReport={generateEquipmentReport}
        genFilename={() => {
          const now = DateTime.now();
          return t(
            ($) => $.stopRegistrySearch.csv.routeReport.equipmentFileName,
            {
              route: routeIdentifier,
              today: mapToShortDate(now),
              now: mapToShortTime(now),
            },
          );
        }}
        text={t(($) => $.stopRegistrySearch.csv.downloadEquipmentReport)}
        type={testIds.equipmentReport}
      />
      <RouteDownloadReportMenuItem
        route={route}
        observationDate={observationDate}
        generateReport={generateInfoSpotReport}
        genFilename={() => {
          const now = DateTime.now();
          return t(
            ($) => $.stopRegistrySearch.csv.routeReport.infoSpotFileName,
            {
              route: routeIdentifier,
              today: mapToShortDate(now),
              now: mapToShortTime(now),
            },
          );
        }}
        text={t(($) => $.stopRegistrySearch.csv.downloadInfoSpotReport)}
        type={testIds.infoSpotReport}
      />
    </SimpleDropdownMenu>
  );
};
