import { FC } from 'react';
import { Listbox, ValueFn } from '../../../uiComponents';

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
  const mapToOption = (item: string) => ({
    key: item,
    value: item,
    render: () => {
      return (
        <div className="cursor-default">
          <div className="ml-2 mr-2">{uiNameMapper(item)}</div>
        </div>
      );
    },
  });

  const options = values.map((item) => mapToOption(item));

  return (
    <Listbox
      id={id}
      testId={testId ?? testIds.dropdown}
      buttonContent={uiNameMapper(value)}
      options={options}
      value={value}
      arrowButtonClassNames="text-hsl-dark-80"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formInputProps}
    />
  );
};
