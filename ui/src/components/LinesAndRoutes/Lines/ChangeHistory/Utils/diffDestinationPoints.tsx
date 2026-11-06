import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { TFunction } from 'i18next';
import { FC, ReactNode } from 'react';
import {
  KeyedChangedValue,
  diffKeyedValues,
} from '../../../../common/ChangeHistory';
import { getFinalValueForDisplay } from '../../../../common/ChangeHistory/ChangedValueCell';
import { RouteData } from '../Types';

const prefix = 'ChangeHistory::ChangedValues::RouteDetails';
const testIds = {
  destinationPoint: (label: string) => `${prefix}::DestinationPoint::${label}`,
  openButton: `${prefix}::DestinationPointDetails::OpenButton`,
  nameFi: `${prefix}::DestinationPointDetails::NameFi`,
  nameSv: `${prefix}::DestinationPointDetails::NameSv`,
  shortNameFi: `${prefix}::DestinationPointDetails::ShortNameFi`,
  shortNameSv: `${prefix}::DestinationPointDetails::ShortNameSv`,
  closeButton: `${prefix}::DestinationPointDetails::CloseButton`,
};

type DestinationItem = {
  readonly label: string;
  readonly sequence: number;
  readonly nameFi: string;
  readonly nameSv: string;
  readonly shortNameFi: string;
  readonly shortNameSv: string;
};

type DefinitionProps = {
  readonly testId: string;
  readonly dt: ReactNode;
  readonly dd: ReactNode;
};
const Definition: FC<DefinitionProps> = ({ testId, dt, dd }) => (
  <>
    <dt className="mt-2 font-bold">{dt}</dt>
    <dd className="mt-1" data-testid={testId}>
      {dd}
    </dd>
  </>
);

type DestinationPointListProps = {
  readonly t: TFunction;
  readonly destinations: ReadonlyArray<DestinationItem>;
};
const DestinationPointList: FC<DestinationPointListProps> = ({
  t,
  destinations,
}) => (
  <ul className="list-disc">
    {destinations.map((destination) => (
      <li
        key={destination.sequence}
        className="flex items-start gap-2 pl-1.5 not-first:mt-2"
        data-testid={testIds.destinationPoint(destination.label)}
      >
        {t(($) => $.lineChangeHistory.destinationPoint, {
          label: destination.label,
          name: destination.nameFi,
        })}

        <Popover className="inline-block">
          <PopoverButton
            data-testid={testIds.openButton}
            title={t(($) => $.lineChangeHistory.destinationPointDetails)}
          >
            <i className="icon-info text-sm text-tweaked-brand" />
          </PopoverButton>
          <PopoverPanel
            anchor="right"
            className="ml-2 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md"
          >
            <div className="mr-6">
              <dl className="text-sm">
                <Definition
                  testId={testIds.nameFi}
                  dt={t(($) => $.destinationModal.name.fi_FI)}
                  dd={getFinalValueForDisplay(destination.nameFi)}
                />
                <Definition
                  testId={testIds.nameSv}
                  dt={t(($) => $.destinationModal.name.sv_FI)}
                  dd={getFinalValueForDisplay(destination.nameSv)}
                />
                <Definition
                  testId={testIds.shortNameFi}
                  dt={t(($) => $.destinationModal.shortName.fi_FI)}
                  dd={getFinalValueForDisplay(destination.shortNameFi)}
                />
                <Definition
                  testId={testIds.shortNameSv}
                  dt={t(($) => $.destinationModal.shortName.sv_FI)}
                  dd={getFinalValueForDisplay(destination.shortNameSv)}
                />
              </dl>
            </div>
            <PopoverButton
              aria-label={t(($) => $.close)}
              data-testid={testIds.closeButton}
            >
              <i className="icon-close-large text-lg" aria-hidden="true" />
            </PopoverButton>
          </PopoverPanel>
        </Popover>
      </li>
    ))}
  </ul>
);

const getDestinations = (
  route: Pick<RouteData, 'stops'>,
): ReadonlyArray<DestinationItem> =>
  route.stops
    .filter((stop) => stop.is_destination_point)
    .map((stop) => ({
      label: stop.scheduled_stop_point_label,
      sequence: stop.scheduled_stop_point_sequence,
      nameFi: stop.destination_point_name_i18n?.fi_FI ?? '',
      nameSv: stop.destination_point_name_i18n?.sv_FI ?? '',
      shortNameFi: stop.destination_point_short_name_i18n?.fi_FI ?? '',
      shortNameSv: stop.destination_point_short_name_i18n?.sv_FI ?? '',
    }));

export function diffDestinationPoints(
  t: TFunction,
  previous: Pick<RouteData, 'stops'>,
  current: Pick<RouteData, 'stops'>,
): Array<KeyedChangedValue | null> {
  return [
    diffKeyedValues({
      key: 'DestinationPoints',
      field: t(($) => $.lineChangeHistory.extraFields.destinationPoints),
      oldValue: getDestinations(previous),
      newValue: getDestinations(current),
      mapper: (destinations) => (
        <DestinationPointList t={t} destinations={destinations} />
      ),
    }),
  ];
}
