import { Listbox, Transition } from '@headlessui/react';
import { FocusEventHandler, Fragment, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import {
  JoreListboxButton,
  dropdownTransition,
  multiselectListboxStyles,
} from '../../../../../../uiComponents';
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
      className={multiselectListboxStyles.option()}
      as="div"
      key={keyOption(option)}
      value={option}
      data-testid={`${testIdBase}::Option::${keyOption(option)}`}
    >
      <MdCheck className="mr-2 rounded border border-grey text-2xl" />
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
    <div key={key} role="group">
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
      className={multiselectListboxStyles.root(className)}
      data-testid={testId}
      disabled={disabled}
      multiple
      onChange={onChange}
      onBlur={onBlur}
      value={value as Array<OptionT>}
    >
      {({ open }) => (
        <>
          <JoreListboxButton id={id} testId={`${testId}::button`}>
            <span>
              {value.length > 1
                ? t('selected', { count: value.length })
                : formatOption(value[0])}
            </span>
          </JoreListboxButton>

          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Transition show={open} as={Fragment} {...dropdownTransition}>
            <Listbox.Options
              as="div"
              static
              className={multiselectListboxStyles.options()}
            >
              {groupsOrOptions.groups ? (
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
