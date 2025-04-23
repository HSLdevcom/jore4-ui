import { Combobox } from '@headlessui/react';
import debounce from 'lodash/debounce';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useController } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineSearch } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
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
    <Combobox<StopModalStopAreaFormSchema, 'div'>
      as="div"
      className={twMerge('flex flex-col', className)}
      name="stopArea"
      nullable
      value={selected}
      onChange={onSelect}
      disabled={disabled}
    >
      <Combobox.Label>{t('stops.stopArea.label')}</Combobox.Label>
      <div className="flex rounded-[5px] focus-within:outline focus-within:outline-1">
        <Combobox.Input<'input', StopModalStopAreaFormSchema>
          ref={ref}
          className="grow rounded-br-none rounded-tr-none border-r-0 outline-0"
          onChange={(e) => onQueryChange(e.target.value)}
          displayValue={(it) => it?.nameFin ?? ''}
          autoComplete="off"
          data-testid={testIds.input}
        />
        <Combobox.Button
          disabled={!query}
          className="flex h-[--input-height] w-[--input-height] items-center justify-center rounded-br-[5px] rounded-tr-[5px] bg-tweaked-brand text-xl"
          title={t('stops.stopArea.search')}
        >
          <MdOutlineSearch color="white" />
        </Combobox.Button>
      </div>
      <ValidationErrorList<StopFormState> fieldPath="stopArea" />

      <Combobox.Options
        as="div"
        className="relative left-0 z-10 w-full rounded-b-md border border-black border-opacity-20 bg-white shadow-md focus:outline-none"
      >
        {loading && (
          <Combobox.Option
            className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
            value={null}
            disabled
            data-testid={testIds.loading}
          >
            {t('stops.stopArea.label')}
          </Combobox.Option>
        )}

        {areas.map((area) => (
          <Combobox.Option
            className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
            key={area.netextId}
            value={area}
            data-testid={testIds.result(area.privateCode)}
          >
            <div className="flex items-start">
              <span className="flex-shrink-0 self-start font-bold">
                {area.privateCode}
              </span>
              <div className="mx-2 flex flex-grow flex-col">
                <span>{area.nameFin ?? area.nameSwe}</span>
                <span className="font-bold">
                  {`${formatIsoDateString(area.validityStart)} - ${formatIsoDateString(area.validityEnd)}`}
                </span>
              </div>
            </div>
          </Combobox.Option>
        ))}

        {!query && !loading && (
          <Combobox.Option
            className="flex cursor-pointer items-center border-b p-2 text-left focus:outline-none ui-active:bg-dark-grey ui-active:text-white"
            value={null}
            disabled
          >
            {t('stops.stopArea.help')}
          </Combobox.Option>
        )}
      </Combobox.Options>
    </Combobox>
  );
};
