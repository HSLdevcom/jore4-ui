import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Label,
} from '@headlessui/react';
import debounce from 'lodash/debounce';
import { FC, useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineSearch } from 'react-icons/md';
import { comboboxStyles } from '../../../../uiComponents';
import { ValidationErrorList } from '../../common';
import { StopFormState, StopModalStopAreaFormSchema } from '../types';
import { formatIsoDateString, useFindStopAreas } from '../utils';

const testIds = {
  input: 'FindStopArea::input',
  loading: 'FindStopArea::loading',
  result: (privateCode: string) => `FindStopArea::stopArea::${privateCode}`,
};

type FindStopAreaProps = {
  readonly className?: string;
  readonly disabled: boolean;
};

export const FindStopArea: FC<FindStopAreaProps> = ({
  className,
  disabled,
}) => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');
  // Is there pending keystrokes in the input field being buffered by debouncing.
  // Set to true on key input and reset to false, after DB query.
  // This is to avoid flickering of the loading state
  const [queryDebounced, setQueryDebounced] = useState(false);
  const { areas, loading: loadingResults } = useFindStopAreas(query);

  const {
    field: { onChange: onSelect, value: selected, ref },
  } = useController<StopFormState, 'stopArea'>({ name: 'stopArea' });

  const onQueryChange = useMemo(() => {
    const debounced = debounce(setQuery, 500);

    return (newQuery: string) => {
      // If the user clears the input field, clear the query state immediately.
      // As a side effect also closes the result list.
      if (newQuery === '') {
        debounced.cancel();
        setQueryDebounced(false);
        setQuery('');
      } else {
        // Mark that we have input incoming, so we may trigger the loading state
        // even tough we are not actually truly loading any data from the DB yet.
        setQueryDebounced(true);
        debounced(newQuery);
      }
    };
  }, []);

  useEffect(() => {
    if (!loadingResults) {
      // Technically we might still have some data in the debounce buffer
      // but from user perspective the actual true loading of data has ended.
      // Once the debounce flushes, it will trigger a true load cycle through the
      // db query, thus triggering the loading state again.
      setQueryDebounced(false);
    }
  }, [loadingResults]);

  const loading = loadingResults || queryDebounced;

  return (
    <Combobox
      as="div"
      className={comboboxStyles.root(
        'flex flex-col justify-between',
        className,
      )}
      name="stopArea"
      value={selected}
      onChange={onSelect}
      disabled={disabled}
    >
      <Label>{t('stops.stopArea.label')}</Label>
      <div className="flex h-[--input-height]">
        <ComboboxInput<StopModalStopAreaFormSchema>
          ref={ref}
          className={comboboxStyles.input(
            'grow border-r-0 outline-0 ui-not-open:rounded-br-none ui-not-open:rounded-tr-none',
            'ui-open:rounded-bl-none',
          )}
          onChange={(e) => onQueryChange(e.target.value)}
          displayValue={(it) => it?.nameFin ?? ''}
          autoComplete="off"
          data-testid={testIds.input}
        />
        <ComboboxButton
          disabled={!query}
          className={comboboxStyles.button(
            'static flex h-[--input-height] w-[--input-height] justify-center rounded-br-[5px] rounded-tr-[5px] bg-tweaked-brand text-xl',
            'ui-open:rounded-br-none',
          )}
          title={t('stops.stopArea.search')}
        >
          <MdOutlineSearch color="white" />
        </ComboboxButton>
      </div>
      <ValidationErrorList<StopFormState> fieldPath="stopArea" />

      <ComboboxOptions
        anchor="bottom start"
        className={comboboxStyles.options(
          'min-w-[calc(var(--button-width)+var(--input-width))]',
        )}
        transition
      >
        {loading && (
          <ComboboxOption
            className={comboboxStyles.option()}
            value={null}
            disabled
            data-testid={testIds.loading}
          >
            {t('stops.stopArea.label')}
          </ComboboxOption>
        )}

        {areas.map((area) => (
          <ComboboxOption
            className={comboboxStyles.option()}
            key={area.netexId}
            value={area}
            data-testid={testIds.result(area.privateCode)}
          >
            <span className="flex-shrink-0 self-start font-bold">
              {area.privateCode}
            </span>
            <div className="mx-2 flex flex-grow flex-col">
              <span>{area.nameFin ?? area.nameSwe}</span>
              <span className="font-bold">
                {`${formatIsoDateString(area.validityStart)} - ${formatIsoDateString(area.validityEnd)}`}
              </span>
            </div>
          </ComboboxOption>
        ))}

        {!query && !loading && (
          <ComboboxOption
            className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
            value={null}
            disabled
          >
            {t('stops.stopArea.help')}
          </ComboboxOption>
        )}
      </ComboboxOptions>
    </Combobox>
  );
};
