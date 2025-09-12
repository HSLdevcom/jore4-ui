import { Listbox, Transition } from '@headlessui/react';
import { FocusEventHandler, Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { twJoin, twMerge } from 'tailwind-merge';
import { dropdownTransition } from '../../../../../../uiComponents';
import { areEqual } from '../../../../../../utils';

type LabellessMenuGroup<OptionT> = {
  readonly key: string;
  readonly label?: never;
  readonly options: ReadonlyArray<OptionT>;
};

type LabelledMenuGroup<OptionT> = {
  readonly key: string;
  readonly label: ReactNode;
  readonly options: ReadonlyArray<OptionT>;
};

export type MenuGroup<OptionT> =
  | LabellessMenuGroup<OptionT>
  | LabelledMenuGroup<OptionT>;

type MultiselectDropdownOptionsProps<OptionT> = {
  readonly formatOption: (option: OptionT) => ReactNode;
  readonly keyOption: (option: OptionT) => string;
  readonly options: ReadonlyArray<OptionT>;
  readonly testIdBase: string;
};

const MultiselectDropdownOptions = <OptionT,>({
  formatOption,
  keyOption,
  options,
  testIdBase,
}: MultiselectDropdownOptionsProps<OptionT>): ReactNode =>
  options.map((option) => (
    <Listbox.Option
      className="flex cursor-pointer items-center py-2 pr-2 text-left focus:outline-none ui-active:bg-background [&_svg]:ui-not-selected:invisible"
      as="div"
      key={keyOption(option)}
      value={option}
      data-testid={`${testIdBase}::Option::${keyOption(option)}`}
    >
      <MdCheck className="mx-1 rounded border border-grey text-2xl text-black" />
      <span>{formatOption(option)}</span>
    </Listbox.Option>
  ));

type MultiselectDropdownGroupsProps<OptionT> = {
  readonly formatOption: (option: OptionT) => ReactNode;
  readonly groups: ReadonlyArray<MenuGroup<OptionT>>;
  readonly keyOption: (option: OptionT) => string;
  readonly testIdBase: string;
};

const MultiselectDropdownGroups = <OptionT,>({
  formatOption,
  groups,
  keyOption,
  testIdBase,
}: MultiselectDropdownGroupsProps<OptionT>): ReactNode =>
  groups.map(({ key, label, options }) => (
    <div className="" key={key} role="group">
      {label ? (
        <span className="block w-full border-b border-grey bg-tweaked-brand px-2 py-2 text-white">
          {label}
        </span>
      ) : null}

      <MultiselectDropdownOptions
        formatOption={formatOption}
        keyOption={keyOption}
        options={options}
        testIdBase={testIdBase}
      />
    </div>
  ));

type MultiselectDropdownFilterBaseProps<OptionT> = {
  readonly className?: string;
  readonly disabled?: boolean;
  readonly formatOption: (option: OptionT) => ReactNode;
  readonly id: string;
  readonly keyOption: (option: OptionT) => string;
  readonly onBlur: FocusEventHandler<HTMLDivElement>;
  readonly onChange: (value: Array<OptionT>) => void;
  readonly testId: string;
  readonly value: ReadonlyArray<OptionT>;
};

type MultiselectDropdownFilterFlatOptionsProps<OptionT> = {
  readonly groups?: never;
  readonly options: ReadonlyArray<OptionT>;
};

type MultiselectDropdownFilterGroupedMenuProps<OptionT> = {
  readonly groups: ReadonlyArray<MenuGroup<OptionT>>;
  readonly options?: never;
};

type MultiselectDropdownFilterProps<OptionT> =
  MultiselectDropdownFilterBaseProps<OptionT> &
    (
      | MultiselectDropdownFilterFlatOptionsProps<OptionT>
      | MultiselectDropdownFilterGroupedMenuProps<OptionT>
    );

export const MultiselectDropdownFilter = <OptionT,>({
  className,
  disabled,
  formatOption,
  id,
  keyOption,
  onBlur,
  onChange,
  testId,
  value,
  ...groupsOrOptions
}: MultiselectDropdownFilterProps<OptionT>): ReactNode => {
  const { t } = useTranslation();

  return (
    <Listbox
      as="div"
      by={areEqual}
      className={twMerge('relative', className)}
      data-testid={testId}
      disabled={disabled}
      multiple
      onChange={onChange}
      onBlur={onBlur}
      value={value as Array<OptionT>}
    >
      {({ open }) => (
        <>
          <Listbox.Button
            id={id}
            className={twJoin(
              'flex h-[var(--input-height)] w-full items-center justify-between rounded-md border border-grey bg-white px-2 py-3 text-left',
              'ui-disabled:bg-background ui-disabled:text-dark-grey',
              'ui-open:rounded-b-none ui-open:border-b-0 ui-open:pb-[calc(0.75rem+1px)]',
            )}
            data-testid={`${testId}::button`}
          >
            <span>
              {value.length > 1
                ? t('selected', { count: value.length })
                : formatOption(value[0])}
            </span>
            <i
              className="icon-arrow rotate-0 text-tweaked-brand transition duration-150 ease-in-out ui-open:-rotate-180"
              style={{ fontSize: 10 }}
            />
          </Listbox.Button>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Listbox.Options
              as="div"
              static
              className="absolute left-0 z-10 w-full rounded-b-md border border-grey bg-white shadow-md focus:outline-none"
            >
              {'groups' in groupsOrOptions &&
              typeof groupsOrOptions.groups === 'object' ? (
                <MultiselectDropdownGroups
                  formatOption={formatOption}
                  groups={groupsOrOptions.groups}
                  keyOption={keyOption}
                  testIdBase={testId}
                />
              ) : (
                <MultiselectDropdownOptions
                  formatOption={formatOption}
                  keyOption={keyOption}
                  options={groupsOrOptions.options}
                  testIdBase={testId}
                />
              )}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
};
