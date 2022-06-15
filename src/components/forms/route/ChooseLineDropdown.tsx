import { DateTime } from 'luxon';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RouteLine,
  useGetCurrentOrFutureLinesByLabelQuery,
} from '../../../generated/graphql';
import { MAX_DATE, MIN_DATE } from '../../../time';
import {
  Combobox,
  FormInputProps as ListboxInputProps,
} from '../../../uiComponents';
import { mapToVariables, replaceStarCharacter } from '../../../utils';
import { DateRange } from '../common';

interface Props extends ListboxInputProps {
  testId?: string;
}

const mapToOptionContent = (item: RouteLine) => (
  <div>
    <span>
      {item.label} ({item.name_i18n.fi_FI})
    </span>
    <div className="text-sm">
      <DateRange
        startDate={item.validity_start || MIN_DATE}
        endDate={item.validity_end || MAX_DATE}
      />
    </div>
  </div>
);

const mapToOption = (item: RouteLine) => ({
  key: item.line_id,
  value: item.line_id,
  render: () => mapToOptionContent(item),
});

export const ChooseLineDropdown = ({
  testId,
  value,
  onChange,
  onBlur,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [query, setQuery] = useState('');

  // Save today to state, because otherwise it will re-render infinitely
  const [today] = useState(DateTime.now());

  const { data: lines } = useGetCurrentOrFutureLinesByLabelQuery(
    mapToVariables({ label: `${query}%`, date: today.toISO() }),
  );

  const sortedLines = lines?.route_line
    ?.slice()
    .sort((a, b) => (a.label > b.label ? 1 : -1));

  // @ts-expect-error typings are off?
  const options = sortedLines?.map(mapToOption) || [];

  const selectedLine = lines?.route_line.find(
    (item) => item.line_id === value,
  ) as RouteLine;

  const mapToButtonContent = (displayedLine?: RouteLine) => {
    // Do not show selected line details while typing
    if (query !== '') {
      return null;
    }

    return (
      <div className="w-full">
        {displayedLine
          ? `${displayedLine?.label} (${displayedLine?.name_i18n.fi_FI})`
          : t('routes.chooseLine')}
      </div>
    );
  };

  const onSelect = (e: { target: { value: string } }) => {
    setQuery('');
    onChange(e);
  };

  return (
    <Combobox
      id="choose-line-combobox"
      testId={testId}
      buttonContent={mapToButtonContent(selectedLine)}
      options={options}
      value={value}
      onChange={onSelect}
      onBlur={onBlur}
      onQueryChange={(str) => setQuery(replaceStarCharacter(str))}
    />
  );
};
