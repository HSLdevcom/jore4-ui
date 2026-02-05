import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { mapDirectionToSymbol } from '../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../time';
import { SelectAllCheckbox } from '../components/SelectAllCheckbox';
import { ResultSelection } from '../types';
import { BatchUpdateSelection, areAllStopsSelected } from '../utils';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useGetLineRouteStopCounts } from './useGetLineRouteStopCounts';
import { useGetLineRouteStopIds } from './useGetLineRouteStopIds';

const testIds = {
  name: 'StopSearchByLine::line::name',
  validity: 'StopSearchByLine::line::validity',
  countAll: 'StopSearchByLine::line::countAll',
  countInbound: 'StopSearchByLine::line::countInbound',
  countOutbound: 'StopSearchByLine::line::countOutbound',
  selectAllLineStops: (id: string) =>
    `StopSearchByLine::line::selectAll::${id}`,
};

type DirectionInfoProps = {
  readonly count: number;
  readonly direction: RouteDirectionEnum;
  readonly testId: string;
};

const DirectionInfo: FC<DirectionInfoProps> = ({
  count,
  direction,
  testId,
}) => {
  const { t } = useTranslation();

  return (
    <span data-testid={testId}>
      <span
        className="mx-2 inline-block h-6 w-6 border border-white bg-brand text-center font-bold text-white"
        data-testid={`${testId}::symbol`}
      >
        {mapDirectionToSymbol(t, direction)}
      </span>
      <span data-testid={`${testId}::count`}>
        {t('stopRegistrySearch.stopsCountShort', { count })}
      </span>
    </span>
  );
};

function findDirectionRouteId(
  line: FindStopByLineInfo,
  direction: RouteDirectionEnum,
): UUID | null {
  return (
    line.line_routes.find((route) => route.direction === direction)?.route_id ??
    null
  );
}

type SelectAllLineStopsProps = {
  readonly onBatchUpdateSelection: BatchUpdateSelection;
  readonly selection: ResultSelection;
  readonly line: FindStopByLineInfo;
  readonly stopIds: ReadonlyArray<UUID>;
};

const SelectAllLineStops: FC<SelectAllLineStopsProps> = ({
  onBatchUpdateSelection,
  selection,
  line,
  stopIds,
}) => {
  const hasNoStops = stopIds.length === 0;
  const allSelected = hasNoStops
    ? false
    : areAllStopsSelected(selection, stopIds);

  const onToggleSelectAll = () =>
    onBatchUpdateSelection((actualSelection) => {
      if (areAllStopsSelected(actualSelection, stopIds)) {
        return { exclude: stopIds };
      }

      return { include: stopIds };
    });

  return (
    <SelectAllCheckbox
      className="ml-[2px]"
      allSelected={allSelected}
      disabled={hasNoStops}
      onToggleSelectAll={onToggleSelectAll}
      testId={testIds.selectAllLineStops(line.line_id)}
    />
  );
};

type ActiveLineHeaderProps = {
  readonly className?: string;
  readonly line: FindStopByLineInfo;
  readonly onBatchUpdateSelection: BatchUpdateSelection;
  readonly selection: ResultSelection;
};

export const ActiveLineHeader: FC<ActiveLineHeaderProps> = ({
  className,
  line,
  onBatchUpdateSelection,
  selection,
}) => {
  const { t } = useTranslation();

  const inboundRouteId = findDirectionRouteId(line, RouteDirectionEnum.Inbound);
  const outboundRouteId = findDirectionRouteId(
    line,
    RouteDirectionEnum.Outbound,
  );
  const { counts, loading } = useGetLineRouteStopCounts(
    inboundRouteId,
    outboundRouteId,
  );

  const routeIds = line.line_routes.map((route) => route.route_id);

  const { stopIds, loading: stopIdsLoading } = useGetLineRouteStopIds(routeIds);

  const showLoadingState = (!counts && loading) || stopIdsLoading;

  return (
    <div className={twMerge('flex items-center gap-5', className)}>
      <SelectAllLineStops
        onBatchUpdateSelection={onBatchUpdateSelection}
        selection={selection}
        line={line}
        stopIds={stopIds}
      />

      <div className="flex w-full items-center gap-4 bg-brand p-4 text-white">
        <div className="font-bold" data-testid={testIds.name}>
          {line.label} {line.name_i18n.fi_FI}
        </div>

        <div data-testid={testIds.validity}>
          {t('validity.validDuring', {
            startDate: mapToShortDate(line.validity_start),
            endDate: mapToShortDate(line.validity_end),
          })}
        </div>

        {counts || loading ? <span>|</span> : null}

        {counts && (
          <div>
            <span data-testid={testIds.countAll}>
              {t('stopRegistrySearch.stopsCount', { count: counts.all })}
            </span>

            <DirectionInfo
              count={counts.outbound}
              direction={RouteDirectionEnum.Outbound}
              testId={testIds.countOutbound}
            />

            <DirectionInfo
              count={counts.inbound}
              direction={RouteDirectionEnum.Inbound}
              testId={testIds.countInbound}
            />
          </div>
        )}

        {showLoadingState && (
          <PulseLoader size={15} color="white" speedMultiplier={0.7} />
        )}
      </div>
    </div>
  );
};
