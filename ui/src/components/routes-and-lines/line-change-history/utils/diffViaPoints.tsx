import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { TFunction } from 'i18next';
import noop from 'lodash/noop';
import { FC, ReactNode } from 'react';
import { CloseIconButton } from '../../../../uiComponents';
import {
  KeyedChangedValue,
  areEqualish,
  diffKeyedValues,
} from '../../../common/ChangeHistory';
import { getFinalValueForDisplay } from '../../../common/ChangeHistory/ChangedValueCell';
import { RouteData, RouteStopData } from '../types';

const testIds = {
  closeButton: 'LineChangeHistory::RouteViaPointDetails::closeButton',
};

type DefinitionProps = {
  readonly dt: ReactNode;
  readonly dd: ReactNode;
};
const Definition: FC<DefinitionProps> = ({ dt, dd }) => {
  return (
    <>
      <dt className="mt-2 font-bold">{dt}</dt>
      <dd className="mt-1">{dd}</dd>
    </>
  );
};

type ViaPointListProps = {
  readonly t: TFunction;
  readonly viaPoints: ReadonlyArray<RouteStopData>;
};
const ViaPointList: FC<ViaPointListProps> = ({ t, viaPoints }) => {
  return (
    <ul className="list-disc">
      {viaPoints.map((viaPoint) => (
        <li
          className="flex items-start gap-2 pl-1.5 not-first:mt-2"
          key={viaPoint.scheduled_stop_point_sequence}
        >
          {t('lineChangeHistory.viaPoint', {
            label: viaPoint.scheduled_stop_point_label,
            name: viaPoint.via_point_name_i18n?.fi_FI ?? '',
          })}

          <Popover className="inline-block">
            <PopoverButton title={t('lineChangeHistory.viaPointDetails')}>
              <i className="icon-info text-sm text-tweaked-brand" />
            </PopoverButton>
            <PopoverPanel
              anchor="right"
              className="ml-2 inline-flex flex-row items-start rounded-lg border border-black bg-white p-3 drop-shadow-md"
            >
              <div className="mr-6">
                <dl className="text-sm">
                  <Definition
                    dt={t('viaModal.viaPointName.fi_FI')}
                    dd={getFinalValueForDisplay(
                      viaPoint.via_point_name_i18n?.fi_FI,
                    )}
                  />
                  <Definition
                    dt={t('viaModal.viaPointName.sv_FI')}
                    dd={getFinalValueForDisplay(
                      viaPoint.via_point_name_i18n?.sv_FI,
                    )}
                  />

                  <Definition
                    dt={t('viaModal.viaPointShortName.fi_FI')}
                    dd={getFinalValueForDisplay(
                      viaPoint.via_point_short_name_i18n?.fi_FI,
                    )}
                  />
                  <Definition
                    dt={t('viaModal.viaPointShortName.sv_FI')}
                    dd={getFinalValueForDisplay(
                      viaPoint.via_point_short_name_i18n?.sv_FI,
                    )}
                  />
                </dl>
              </div>
              <PopoverButton>
                <CloseIconButton onClick={noop} testId={testIds.closeButton} />
              </PopoverButton>
            </PopoverPanel>
          </Popover>
        </li>
      ))}
    </ul>
  );
};

function areViaPointDetailsEqual(
  previous: ReadonlyArray<RouteStopData>,
  current: ReadonlyArray<RouteStopData>,
): boolean {
  if (previous.length !== current.length) {
    return false;
  }

  for (let i = 0; i < previous.length; i += 1) {
    const a = previous[i];
    const b = current[i];

    const equal =
      areEqualish(a.via_point_name_i18n?.fi_FI, b.via_point_name_i18n?.fi_FI) &&
      areEqualish(a.via_point_name_i18n?.sv_FI, b.via_point_name_i18n?.sv_FI) &&
      areEqualish(
        a.via_point_short_name_i18n?.fi_FI,
        b.via_point_short_name_i18n?.fi_FI,
      ) &&
      areEqualish(
        a.via_point_short_name_i18n?.sv_FI,
        b.via_point_short_name_i18n?.sv_FI,
      );

    if (!equal) {
      return false;
    }
  }

  return true;
}

export function diffViaPoints(
  t: TFunction,
  previous: RouteData,
  current: RouteData,
): Array<KeyedChangedValue | null> {
  const previousViaPoints = previous.stops.filter((it) => it.is_via_point);
  const currentViaPoints = current.stops.filter((it) => it.is_via_point);

  return [
    diffKeyedValues({
      key: 'ViaPoints',
      field: t('lineChangeHistory.extraFields.viaPoints'),
      compare: areViaPointDetailsEqual,
      oldValue: previousViaPoints,
      newValue: currentViaPoints,
      mapper: (viaPoints) => <ViaPointList t={t} viaPoints={viaPoints} />,
    }),
  ];
}
