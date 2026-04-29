import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import debounce from 'lodash/debounce';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineSearch } from 'react-icons/md';
import { ReusableComponentsVehicleModeEnum } from '../../../../../generated/graphql';
import { comboboxStyles } from '../../../../../uiComponents';
import { StopModalStopAreaFormSchema } from '../../../../forms/stop/types';
import {
  formatIsoDateString,
  useFindStopAreas,
} from '../../../../forms/stop/utils';

type StopAreaSearchComboboxProps = {
  readonly vehicleMode: ReusableComponentsVehicleModeEnum | null | undefined;
  readonly value: StopModalStopAreaFormSchema | null;
  readonly onChange: (value: StopModalStopAreaFormSchema | null) => void;
  readonly disabled: boolean;
  readonly inputTestId: string;
  readonly optionTestId: (code: string) => string;
};

export const StopAreaSearchCombobox: FC<StopAreaSearchComboboxProps> = ({
  vehicleMode,
  value,
  onChange,
  disabled,
  inputTestId,
  optionTestId,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  const [queryDebounced, setQueryDebounced] = useState(false);
  const { areas, loading: loadingAreas } = useFindStopAreas(query, vehicleMode);

  useEffect(() => {
    if (!loadingAreas) {
      setQueryDebounced(false);
    }
  }, [loadingAreas]);

  const onQueryChange = useMemo(() => {
    const debouncedSetQuery = debounce(setQuery, 500);
    return (newQuery: string) => {
      if (newQuery === '') {
        debouncedSetQuery.cancel();
        setQueryDebounced(false);
        setQuery('');
      } else {
        setQueryDebounced(true);
        debouncedSetQuery(newQuery);
      }
    };
  }, []);

  const areaSearchLoading = loadingAreas || queryDebounced;

  return (
    <Combobox
      as="div"
      className={comboboxStyles.root('flex flex-col')}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <div className="flex h-(--input-height)">
        <ComboboxInput<StopModalStopAreaFormSchema>
          className={comboboxStyles.input(
            'grow border-r-0 outline-0 ui-not-open:rounded-tr-none ui-not-open:rounded-br-none',
            'ui-open:rounded-bl-none',
          )}
          onChange={(e) => onQueryChange(e.target.value)}
          displayValue={(it) => it?.nameFin ?? ''}
          autoComplete="off"
          placeholder={t(($) => $.stopDetails.hybrid.searchStopArea)}
          data-testid={inputTestId}
        />
        <ComboboxButton
          disabled={!query}
          className={comboboxStyles.button(
            'static flex h-(--input-height) w-(--input-height) justify-center rounded-tr-[5px] rounded-br-[5px] bg-tweaked-brand text-xl',
            'ui-open:rounded-br-none',
          )}
        >
          <MdOutlineSearch color="white" />
        </ComboboxButton>
      </div>
      <ComboboxOptions
        anchor="bottom start"
        className={comboboxStyles.options(
          'min-w-[calc(var(--button-width)+var(--input-width))]',
        )}
        transition
      >
        {areaSearchLoading && (
          <ComboboxOption
            className={comboboxStyles.option()}
            value={null}
            disabled
          >
            {t(($) => $.stops.stopArea.label)}
          </ComboboxOption>
        )}

        {areas.map((area) => (
          <ComboboxOption
            className={comboboxStyles.option()}
            key={area.netexId}
            value={area}
            data-testid={optionTestId(area.privateCode)}
          >
            <span className="shrink-0 self-start font-bold">
              {area.privateCode}
            </span>
            <div className="mx-2 flex grow flex-col">
              <span>{area.nameFin ?? area.nameSwe}</span>
              <span className="font-bold">
                {`${formatIsoDateString(area.validityStart)} - ${formatIsoDateString(area.validityEnd)}`}
              </span>
            </div>
          </ComboboxOption>
        ))}

        {!query && !areaSearchLoading && (
          <ComboboxOption
            className={comboboxStyles.option()}
            value={null}
            disabled
          >
            {t(($) => $.stops.stopArea.help)}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
};
