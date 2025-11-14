import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../../i18n';
import { StopGroupSelector, StopGroupSelectorItem } from '../StopGroupSelector';
import { FindStopPlaceInfo } from './useFindStopPlaces';

type StopPlaceSelectorProps = {
  readonly className?: string;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly translationLabel: TranslationKey;
};

export const StopPlaceSelector: FC<StopPlaceSelectorProps> = ({
  className,
  stopPlaces,
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
      label={(count) => t(translationLabel, { count })}
    />
  );
};
