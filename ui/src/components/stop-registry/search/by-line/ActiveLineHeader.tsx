import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { PulseLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';
import { RouteDirectionEnum } from '../../../../generated/graphql';
import { mapDirectionToSymbol } from '../../../../i18n/uiNameMappings';
import { mapToShortDate } from '../../../../time';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useGetLineRouteStopCounts } from './useGetLineRouteStopCounts';

const testIds = {
  name: 'StopSearchByLine::line::name',
  validity: 'StopSearchByLine::line::validity',
  countAll: 'StopSearchByLine::line::countAll',
  countInbound: 'StopSearchByLine::line::countInbound',
  countOutbound: 'StopSearchByLine::line::countOutbound',
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

type ActiveLineHeaderProps = {
  readonly className?: string;
  readonly line: FindStopByLineInfo;
};

export const ActiveLineHeader: FC<ActiveLineHeaderProps> = ({
  className,
  line,
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

  return (
    <div
      className={twMerge(
        'flex items-center gap-4 bg-brand p-4 text-white',
        className,
      )}
    >
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

      {!counts && loading && (
        <PulseLoader size={15} color="white" speedMultiplier={0.7} />
      )}
    </div>
  );
};
