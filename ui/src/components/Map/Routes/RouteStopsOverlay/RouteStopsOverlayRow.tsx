import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteStopFieldsFragment } from '../../../../generated/graphql';
import { SimpleDropdownMenu } from '../../../common/Dropdowns';
import { useMapObservationDate } from '../../Utils/mapUrlState';
import { ShowDetailsPage, ToggleOnRoute } from './MenuItems';
import { StopDetails } from './StopDetails';

const testIds = {
  row: 'RouteStopsOverlayRow',
  menuButton: 'RouteStopsOverlayRow::menu',
};

type RouteStopsOverlayRowProps = {
  readonly belongsToJourneyPattern: boolean;
  readonly stop: RouteStopFieldsFragment;
  readonly isReadOnly?: boolean;
};

export const RouteStopsOverlayRow: FC<RouteStopsOverlayRowProps> = ({
  belongsToJourneyPattern,
  stop,
  isReadOnly,
}) => {
  const { t } = useTranslation();

  const observationDate = useMapObservationDate();

  return (
    <div
      data-testid={testIds.row}
      className="flex h-10 items-center justify-between border-b p-2"
    >
      <StopDetails
        belongsToJourneyPattern={belongsToJourneyPattern}
        stop={stop}
      />

      <SimpleDropdownMenu
        className="text-tweaked-brand"
        testId={testIds.menuButton}
        tooltip={t(($) => $.accessibility.map.routeStopsOverlayRowActions, {
          stopLabel: stop.label,
        })}
      >
        <ShowDetailsPage
          isReadOnly={isReadOnly}
          stop={stop}
          observationDate={observationDate}
        />

        {!isReadOnly && (
          <ToggleOnRoute
            belongsToJourneyPattern={belongsToJourneyPattern}
            stop={stop}
          />
        )}
      </SimpleDropdownMenu>
    </div>
  );
};
