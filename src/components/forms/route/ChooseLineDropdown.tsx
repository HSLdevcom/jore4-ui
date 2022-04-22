import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteLine, useListAllLinesQuery } from '../../../generated/graphql';
import {
  FormInputProps as ListboxInputProps,
  Listbox,
} from '../../../uiComponents';

interface Props extends ListboxInputProps {
  testId?: string;
}

const mapToOptionContent = (item: RouteLine) => (
  <span>{`${item.label} (${item.name_i18n})`}</span>
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
  const { data: lines } = useListAllLinesQuery();
  const { t } = useTranslation();

  // @ts-expect-error typings are off?
  const options = lines?.route_line.map(mapToOption) || [];

  const selectedLine = lines?.route_line.find(
    (item) => item.line_id === value,
  ) as RouteLine;

  // if no line is selected, show "Choose line"
  const mapToButtonContent = (displayedLine?: RouteLine) => (
    <div className="w-full">
      {displayedLine
        ? `${displayedLine.label} (${displayedLine.name_i18n})`
        : t('routes.chooseLine')}
    </div>
  );

  return (
    <Listbox
      testId={testId}
      buttonContent={mapToButtonContent(selectedLine)}
      options={options}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
