import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopGroupSelector, StopGroupSelectorItem } from '../components';
import { FindStopAreaInfo } from './useFindStopAreas';

type StopAreaSelectorProps = {
  readonly activeStopId: string | null;
  readonly className?: string;
  readonly stopAreas: ReadonlyArray<FindStopAreaInfo>;
  readonly setActiveStopId: (activeLineId: string | null) => void;
};

export const StopAreaSelector: FC<StopAreaSelectorProps> = ({
  activeStopId,
  className,
  stopAreas,
  setActiveStopId,
}) => {
  const { t } = useTranslation();

  const groups: ReadonlyArray<StopGroupSelectorItem<string>> = useMemo(
    () =>
      stopAreas.map(
        ({
          id,
          netex_id: netextId,
          private_code: label,
          name_value: title,
        }) => ({
          id: id.toString(10),
          label: label ?? netextId ?? id.toString(10),
          title: title ?? '',
        }),
      ),
    [stopAreas],
  );

  return (
    <StopGroupSelector
      className={className}
      groups={groups}
      label={t('stopRegistrySearch.stopAreas')}
      onSelect={setActiveStopId}
      selected={activeStopId ?? null}
    />
  );
};
