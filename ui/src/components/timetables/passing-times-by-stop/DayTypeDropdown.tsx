import { FC } from 'react';
import { JoreListbox, ListboxOptionItem, ValueFn } from '../../../uiComponents';

const testIds = {
  dropdown: 'DayTypeDropdown',
};

export type DayTypeDropdownProps = {
  readonly id?: string;
  readonly uiNameMapper: (key: string) => string;
  readonly testId?: string;
  readonly values: ReadonlyArray<string>;
  readonly value: string;
  readonly onChange: ValueFn;
  readonly buttonClassNames?: string;
};

/**
 * Creates dropdown from day type values
 */
export const DayTypeDropdown: FC<DayTypeDropdownProps> = ({
  id,
  testId,
  uiNameMapper,
  value,
  values,
  ...formInputProps
}) => {
  const options: ReadonlyArray<ListboxOptionItem<string>> = values.map(
    (item) => ({ value: item, content: uiNameMapper(item) }),
  );

  return (
    <JoreListbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={uiNameMapper(value)}
      options={options}
      value={value}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
