import { Listbox } from '@headlessui/react';
import { ReactElement, ReactNode, Ref, forwardRef } from 'react';
import { ControllerFieldState, Noop } from 'react-hook-form';
import { JoreListboxButton, listboxStyles } from './headlessHelpers';
import { JoreListboxOptions, ListboxOptionItem } from './JoreListboxOptions';

// copied from HeadlessUI Listbox as it's not exported
export type ValueFn = (...event: ExplicitAny[]) => void;

// TODO: Move and/or inline these into a proper/better place
export type BaseFormInputProps = {
  readonly onBlur?: Noop;
  readonly fieldState?: ControllerFieldState;
  readonly disabled?: boolean;
};

export type FormInputProps = BaseFormInputProps & {
  readonly value?: string;
  readonly onChange: ValueFn;
};

export type TypedFormInputProps<ValueType> = BaseFormInputProps & {
  readonly value?: ValueType;
  readonly onChange: (newValue: ValueType) => void;
};

type JoreListboxProps<ValueType> = TypedFormInputProps<ValueType> & {
  readonly id?: string;
  readonly buttonClassNames?: string;
  readonly buttonContent: ReactNode;
  readonly className?: string;
  readonly options: ReadonlyArray<ListboxOptionItem<ValueType>>;
  readonly testId?: string;
};

const JoreListboxImpl = <ValueType extends string>(
  {
    id,
    buttonContent,
    buttonClassNames,
    className,
    testId,
    options,
    value,
    onChange,
    onBlur,
    fieldState,
    disabled = false,
  }: JoreListboxProps<ValueType>,
  ref: Ref<HTMLDivElement>,
): ReactElement => {
  const hasError = !!fieldState?.error;

  return (
    <Listbox
      id={id ?? 'listbox'}
      as="div"
      className={listboxStyles.root(className)}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      ref={ref}
    >
      <JoreListboxButton
        className={buttonClassNames}
        hasError={hasError}
        testId={`${testId}::ListboxButton`}
      >
        {buttonContent}
      </JoreListboxButton>

      <JoreListboxOptions
        testId={`${testId}::ListboxOptions`}
        options={options}
      />
    </Listbox>
  );
};

export const JoreListbox = forwardRef(JoreListboxImpl) as (<
  ValueType extends string,
>(
  p: JoreListboxProps<ValueType> & { ref?: Ref<HTMLDivElement> },
) => ReactElement) & { displayName?: string };
JoreListbox.displayName = 'JoreListbox';
