import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteWithInfrastructureLinksWithStopsAndJpsFragment } from '../../../../../generated/graphql';
import { now } from '../../../../../time/dateTime';
import { mapToShortDate, mapToShortTime } from '../../../../../time/format';
import { getRouteLabelVariantText } from '../../../../../utils';
import { mapDirectionToSymbol } from '../../../../../utils/i18n';
import { SimpleDropdownMenu } from '../../../../common/Dropdowns';
import { RouteDownloadReportMenuItem } from './RouteDownloadReportMenuItem';
import {
  useGenerateRouteEquipmentReport,
  useGenerateRouteInfoSpotReport,
} from './useGenerateRouteReport';

const testIds = {
  menu: 'RouteReportDownloadMenu::menu',
  equipmentReport: 'RouteEquipmentReport',
  infoSpotReport: 'RouteInfoSpotReport',
};

type RouteReportDownloadMenuProps = {
  readonly route: RouteWithInfrastructureLinksWithStopsAndJpsFragment;
  readonly observationDate: Temporal.PlainDate;
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

  const routeIdentifier = `${getRouteLabelVariantText(route)} ${mapDirectionToSymbol(t, route.direction)}`;

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
          const currentTime = now();
          return t(
            ($) => $.stopRegistrySearch.csv.routeReport.equipmentFileName,
            {
              route: routeIdentifier,
              today: mapToShortDate(currentTime.toPlainDate()),
              now: mapToShortTime(currentTime),
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
          const currentTime = now();
          return t(
            ($) => $.stopRegistrySearch.csv.routeReport.infoSpotFileName,
            {
              route: routeIdentifier,
              today: mapToShortDate(currentTime.toPlainDate()),
              now: mapToShortTime(currentTime),
            },
          );
        }}
        text={t(($) => $.stopRegistrySearch.csv.downloadInfoSpotReport)}
        type={testIds.infoSpotReport}
      />
    </SimpleDropdownMenu>
  );
};
