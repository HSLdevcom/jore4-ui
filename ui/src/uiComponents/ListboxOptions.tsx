import { Listbox as HUIListbox } from '@headlessui/react';
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

type ListboxOptionsProps<ValueType> = {
  readonly className?: string;
  readonly optionClassName?: string;
  readonly options: ReadonlyArray<ListboxOptionItem<ValueType>>;
  readonly testId: string;
};

// HUIListbox throws an error if ref is not set when using children component for options
const ListboxOptionsImpl = <ValueType extends string>(
  {
    className,
    optionClassName,
    options,
    testId,
  }: ListboxOptionsProps<ValueType>,
  ref: Ref<HTMLDivElement>,
): ReactElement => (
  <HUIListbox.Options
    as="div"
    data-testid={testId}
    ref={ref}
    className={listboxStyles.options(className)}
  >
    {options?.map((item) => (
      <HUIListbox.Option
        as="div"
        className={listboxStyles.option(optionClassName)}
        id={`listbox-option-${item.value}`}
        key={item.value}
        value={item.value}
        data-testid={`${testId}::${item.value}`}
      >
        {'content' in item ? item.content : wrapInFragment(item.render)}
      </HUIListbox.Option>
    ))}
  </HUIListbox.Options>
);

export const ListboxOptions = forwardRef(ListboxOptionsImpl) as (<
  ValueType extends string = string,
>(
  p: ListboxOptionsProps<ValueType> & { ref?: Ref<HTMLDivElement> },
) => ReactElement) & { displayName?: string | undefined };
ListboxOptions.displayName = 'ListboxOptions';
