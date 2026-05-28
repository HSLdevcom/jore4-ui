import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import {
  LineAllFieldsFragment,
  ReusableComponentsVehicleModeEnum,
} from '../../../generated/graphql';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { Column, Container, Row, Visible } from '../../../layoutComponents';
import {
  resetMapRouteEditorStateAction,
  selectIsTimingSettingsModalOpen,
  selectIsViaModalOpen,
  setLineInfoAction,
  startRouteCreatingAction,
} from '../../../redux';
import { Priority } from '../../../types/enums';
import { isPastEntity } from '../../../utils';
import { useNavigateToMap } from '../../map/utils/useNavigateToMap';
import { PageHeader } from '../common/PageHeader';
import { LineLatestChanges } from '../line-change-history/components/latest-change-history/LineLatestChanges';
import { TimingSettingsModal } from '../stop-timing-settings/TimingSettingsModal';
import { ViaModal } from '../via/ViaModal';
import { ActionsRow } from './ActionsRow';
import { AdditionalInformation } from './AdditionalInformation';
import { CreateRouteBox } from './CreateRouteBox';
import { LineDetailsEmptyMapPlaceholder } from './LineDetailsEmptyMapPlaceholder';
import { LineMissingBox } from './LineMissingBox';
import { LineRouteList } from './LineRouteList';
import { LineTitle } from './LineTitle';
import { MapPreview } from './MapPreview';
import { LineFetchError, useGetLineDetails } from './useGetLineDetails';
import { useGetRoutesDisplayedInList } from './useGetRoutesDisplayedInList';

export function showIconForVehicleMode(
  vehicleMode: ReusableComponentsVehicleModeEnum | null,
  className?: string,
) {
  switch (vehicleMode) {
    case ReusableComponentsVehicleModeEnum.Bus:
      return (
        <i className={twJoin('icon-bus-alt text-tweaked-brand', className)} />
      );
    case ReusableComponentsVehicleModeEnum.Tram:
      return (
        <i
          className={twJoin(
            'icon-tram-filled text-hsl-tram-dark-green',
            className,
          )}
        />
      );
    case ReusableComponentsVehicleModeEnum.Metro:
      return (
        <i
          className={twJoin(
            'icon-metro-filled text-hsl-metro-orange',
            className,
          )}
        />
      );
    case ReusableComponentsVehicleModeEnum.Ferry:
      return (
        <i
          className={twJoin('icon-ferry-filled text-hsl-ferry-blue', className)}
        />
      );
    case ReusableComponentsVehicleModeEnum.Train:
      return (
        <i
          className={twJoin(
            'icon-train-filled text-hsl-train-purple',
            className,
          )}
        />
      );
    default:
      return null;
  }
}

export const LineDetailsByIdPage: FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const navigateToMap = useNavigateToMap();

  const { line, lineError } = useGetLineDetails();

  const { displayedRouteLabels } = useGetRoutesDisplayedInList(line);

  const createRoute = (routeLine: LineAllFieldsFragment) => {
    dispatch(resetMapRouteEditorStateAction());
    dispatch(setLineInfoAction(routeLine));
    dispatch(startRouteCreatingAction());
    navigateToMap();
  };

  const isViaModalOpen = useAppSelector(selectIsViaModalOpen);
  const isTimingSettingsModalOpen = useAppSelector(
    selectIsTimingSettingsModalOpen,
  );

  const getHeaderBorderClassName = () => {
    if (line?.priority === Priority.Draft) {
      return 'border-b-4 border-medium-grey border-dashed';
    }
    if (line?.priority === Priority.Temporary) {
      return 'border-b-4 border-city-bicycle-yellow';
    }
    return '';
  };

  const isRouteCreationAllowed = line && !isPastEntity(DateTime.now(), line);
  const onCreateRoute = isRouteCreationAllowed
    ? () => createRoute(line)
    : undefined;

  const displayedRoutes =
    line?.line_routes?.filter((route) =>
      displayedRouteLabels?.includes(route.label),
    ) ?? [];

  return (
    <div>
      <PageHeader className={getHeaderBorderClassName()}>
        <Row>
          {showIconForVehicleMode(
            line?.primary_vehicle_mode ?? null,
            'text-6xl mt-2',
          )}
          {line && <LineTitle line={line} onCreateRoute={onCreateRoute} />}
        </Row>
      </PageHeader>
      <ActionsRow className="pt-4 pb-0" />
      <Container className="pt-10">
        {line ? (
          <>
            <Row>
              <AdditionalInformation className="w-2/4" line={line} />
              <LineLatestChanges className="w-1/4" label={line.label} />
              <MapPreview className="w-1/4" />
            </Row>
            <Row>
              <Column className="w-full">
                <h2 className="mt-8">{t(($) => $.lines.routes)}</h2>
                {line.line_routes?.length > 0 ? (
                  <LineRouteList routes={displayedRoutes} />
                ) : (
                  <CreateRouteBox onCreateRoute={onCreateRoute} />
                )}
              </Column>
            </Row>
          </>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            <div className="col col-span-3">
              <LineMissingBox
                error={lineError ?? LineFetchError.LINE_MISSING_DEFAULT}
              />
            </div>
            <div className="col col-span-1">
              <LineDetailsEmptyMapPlaceholder />
            </div>
          </div>
        )}
      </Container>
      <Visible visible={isViaModalOpen}>
        <ViaModal />
      </Visible>
      <Visible visible={isTimingSettingsModalOpen}>
        <TimingSettingsModal />
      </Visible>
    </div>
  );
};
