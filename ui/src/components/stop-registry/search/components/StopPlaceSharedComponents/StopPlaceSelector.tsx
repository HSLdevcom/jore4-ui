import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopGroupSelector, StopGroupSelectorItem } from '../StopGroupSelector';
import { FindStopPlaceInfo } from './useFindStopPlaces';

type StopPlaceSelectorProps = {
  readonly activeStopPlaceIds: ReadonlyArray<string> | null;
  readonly className?: string;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly setActiveStopPlaceIds: (
    activeStopIds: ReadonlyArray<string> | null,
  ) => void;
  readonly translationLabel: string;
};

export const StopPlaceSelector: FC<StopPlaceSelectorProps> = ({
  activeStopPlaceIds,
  className,
  stopPlaces,
  setActiveStopPlaceIds,
  translationLabel,
}) => {
  const { t } = useTranslation();

  const groups: ReadonlyArray<StopGroupSelectorItem<string>> = useMemo(
    () =>
      stopPlaces.map(
        ({
          id,
          netex_id: netexId,
          private_code: label,
          name_value: title,
        }) => ({
          id: id.toString(10),
          label: label ?? netexId ?? id.toString(10),
          title: title ?? '',
        }),
      ),
    [stopPlaces],
  );

  return (
    <StopGroupSelector
      className={className}
      groups={groups}
      label={t(translationLabel, {
        count: activeStopPlaceIds?.length ?? 0,
      })}
      onSelect={setActiveStopPlaceIds}
      selected={activeStopPlaceIds}
    />
  );
};
