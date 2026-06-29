import { Listbox } from '@headlessui/react';
import { ReactElement, ReactNode, Ref, forwardRef } from 'react';
import { TypedFormInputProps } from '../FormInputTypes';
import { listboxStyles } from './headlessHelpers';
import { JoreListboxButton } from './JoreListboxButton';
import { JoreListboxOptions, ListboxOptionItem } from './JoreListboxOptions';

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
