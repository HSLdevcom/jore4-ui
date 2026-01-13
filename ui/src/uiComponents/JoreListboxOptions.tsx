import { ListboxOption, ListboxOptions } from '@headlessui/react';
import { ReactElement, ReactNode, Ref, forwardRef } from 'react';
import { listboxStyles } from './headlessHelpers';

// copied from HeadlessUI Listbox as it's not exported
export type OptionRenderPropArg = {
  readonly active: boolean;
  readonly selected: boolean;
  readonly disabled: boolean;
};

function wrapInFragment(
  renderer: (props: OptionRenderPropArg) => ReactNode,
): (props: OptionRenderPropArg) => ReactElement {
  const wrapped = (props: OptionRenderPropArg) => <>{renderer(props)}</>;

  const name = renderer.name || 'unnamed render function';
  wrapped.displayName = `ListboxOptionFragmentWrapper(${name})`;

  return wrapped;
}

export type ListboxOptionItem<ValueType> =
  | {
      readonly value: ValueType;
      readonly render: (props: OptionRenderPropArg) => ReactNode;
      readonly content?: never;
    }
  | {
      readonly value: ValueType;
      readonly render?: never;
      readonly content: ReactNode;
    };

type JoreListboxOptionsProps<ValueType> = {
  readonly className?: string;
  readonly optionClassName?: string;
  readonly options: ReadonlyArray<ListboxOptionItem<ValueType>>;
  readonly testId: string;
};

// HUIListbox throws an error if ref is not set when using children component for options
const JoreListboxOptionsImpl = <ValueType extends string>(
  {
    className,
    optionClassName,
    options,
    testId,
  }: JoreListboxOptionsProps<ValueType>,
  ref: Ref<HTMLDivElement>,
): ReactElement => (
  <ListboxOptions
    anchor="bottom start"
    data-testid={testId}
    ref={ref}
    className={listboxStyles.options(className)}
    transition
  >
    {options?.map((item) => (
      <ListboxOption
        className={listboxStyles.option(optionClassName)}
        id={`listbox-option-${item.value}`}
        key={item.value}
        value={item.value}
        data-testid={`${testId}::${item.value}`}
      >
        {'content' in item ? item.content : wrapInFragment(item.render)}
      </ListboxOption>
    ))}
  </ListboxOptions>
);

export const JoreListboxOptions = forwardRef(JoreListboxOptionsImpl) as (<
  ValueType extends string = string,
>(
  p: JoreListboxOptionsProps<ValueType> & { ref?: Ref<HTMLDivElement> },
) => ReactElement) & { displayName?: string | undefined };
JoreListboxOptions.displayName = 'JoreListboxOptions';
