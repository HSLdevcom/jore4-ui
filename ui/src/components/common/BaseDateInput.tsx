import { DateTime } from 'luxon';
import {
  ChangeEventHandler,
  ClipboardEventHandler,
  FocusEventHandler,
  ForwardRefRenderFunction,
  InputHTMLAttributes,
  KeyboardEventHandler,
  forwardRef,
  useEffect,
  useState,
} from 'react';
import { DateLike, mapToShortDate, tryToParseDate } from '../../time';

type ParsedNotNull = {
  readonly parsed: true;
  readonly nullable?: false | never;
  readonly value: DateTime;
  readonly onChange: (value: DateTime) => void;
};

type ParsedNullable = {
  readonly parsed: true;
  readonly nullable: true;
  readonly value: DateTime | null | undefined;
  readonly onChange: (value: DateTime | null) => void;
};

type RawNotNull = {
  readonly parsed?: false | never;
  readonly nullable?: false | never;
  readonly value: string;
  readonly onChange: (value: string) => void;
};

type RawNullable = {
  readonly parsed?: false | never;
  readonly nullable: true;
  readonly value: string | null | undefined;
  readonly onChange: (value: string | null) => void;
};

type GenericInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type' | 'value'
>;

type BaseDateInputProps = GenericInputProps &
  (ParsedNotNull | ParsedNullable | RawNotNull | RawNullable);

function valueToString(value: DateLike | null | undefined): string {
  return tryToParseDate(value)?.toISODate() ?? '';
}

const typeISODate = 'hus/ISOData';
const typePlainText = 'text/plain';

const isoDateRegexp = /\d{4}-\d{2}-\d{2}/;
const cleanIsoDateRegexp = /^\d{4}-\d{2}-\d{2}$/;
const formattedDateRegexp = /(\d{1,2}).(\d{1,2}).(\d{4})/;

type DateValuePair = {
  readonly parsed: DateTime;
  readonly str: string;
};

function getIsoDateData(data: DataTransfer) {
  const isoDateData = data.getData(typeISODate);
  if (isoDateData) {
    return isoDateData;
  }

  const plainTextIsoDateData = data.getData(typePlainText);
  const match = isoDateRegexp.exec(plainTextIsoDateData);
  if (match) {
    return match[0];
  }

  return null;
}

function tryToParseIsoDate(data: DataTransfer): DateValuePair | null {
  const isoDateData = getIsoDateData(data);
  const parsed = tryToParseDate(isoDateData);

  if (isoDateData && parsed) {
    return { parsed, str: isoDateData };
  }

  return null;
}

function tryToParseFormattedDate(data: DataTransfer): DateValuePair | null {
  const plainTextData = data.getData(typePlainText);
  const match = formattedDateRegexp.exec(plainTextData);

  if (match) {
    const [, day, month, year] = match;
    const isoDateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const parsed = tryToParseDate(isoDateStr);

    if (parsed) {
      return { parsed, str: isoDateStr };
    }
  }

  return null;
}

function getDateFromClipboard(data: DataTransfer): DateValuePair | null {
  return tryToParseIsoDate(data) ?? tryToParseFormattedDate(data);
}

const BaseDateInputImpl: ForwardRefRenderFunction<
  HTMLInputElement,
  BaseDateInputProps
> = (
  {
    parsed,
    nullable,
    value,
    onBlur,
    onChange,
    onCopy,
    onKeyUp,
    onPaste,
    ...rest
  },
  ref,
) => {
  const [str, setStr] = useState(() => valueToString(value));

  useEffect(() => setStr(() => valueToString(value)), [value]);

  // Only expose full proper dates to the outside world.
  const augmentedOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value;
    setStr(newValue);

    const parsedValue = tryToParseDate(newValue);

    if (parsedValue) {
      if (parsed) {
        onChange(parsedValue);
      } else {
        onChange(newValue);
      }
    }

    if (nullable && !newValue) {
      onChange(null);
    }
  };

  // If we have partial input when losing focus. Clear out the whole input for
  // nullable fields, or reset to the previous set value for non nullable.
  const augmentedOnBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const parsedValue = tryToParseDate(str);
    if (!parsedValue) {
      if (nullable) {
        setStr('');
        onChange(null);
      } else {
        setStr(typeof value === 'string' ? value : value.toISODate());
      }
    }
    onBlur?.(e);
  };

  // Shortcut to set current date as the value.
  const augmentedOnKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const normalizedKey = e.key.toLowerCase();
    if (normalizedKey === 't' || normalizedKey === 'n') {
      const today = DateTime.now().startOf('day');
      const todayStr = today.toISODate();
      setStr(todayStr);
      if (parsed) {
        onChange(today);
      } else {
        onChange(todayStr);
      }
    }

    onKeyUp?.(e);
  };

  // Add handling for copying out current value.
  const augmentedOnCopy: ClipboardEventHandler<HTMLInputElement> = (e) => {
    if (str.match(cleanIsoDateRegexp)) {
      e.clipboardData.setData(typeISODate, str);
      e.clipboardData.setData(typePlainText, mapToShortDate(str) ?? '');
      e.preventDefault();
    }
    onCopy?.(e);
  };

  // Add handling for pasting in dates.
  const augmentedOnPaste: ClipboardEventHandler<HTMLInputElement> = (e) => {
    const date = getDateFromClipboard(e.clipboardData);
    if (date) {
      setStr(date.str);

      if (parsed) {
        onChange(date.parsed);
      } else {
        onChange(date.str);
      }

      e.preventDefault();
      e.stopPropagation();
    } else {
      onPaste?.(e);
    }
  };

  return (
    <input
      onBlur={augmentedOnBlur}
      onChange={augmentedOnChange}
      onCopy={augmentedOnCopy}
      onKeyUp={augmentedOnKeyUp}
      onPaste={augmentedOnPaste}
      ref={ref}
      type="date"
      value={str}
      {...rest}
    />
  );
};

export const BaseDateInput = forwardRef(BaseDateInputImpl);

type CompatBaseDateInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> & {
  // Good enough shape for react hook forms
  readonly onChange: (e: { target: { value: string }; type: 'change' }) => void;
};

const CompatBaseDateInputImpl: ForwardRefRenderFunction<
  HTMLInputElement,
  CompatBaseDateInputProps
> = (props, ref) =>
  BaseDateInputImpl(
    {
      ...props,
      parsed: false,
      nullable: true,
      value: props.value ? String(props.value) : '',
      onChange: (value) =>
        props.onChange({ target: { value: value ?? '' }, type: 'change' }),
    },
    ref,
  );

export const CompatBaseDateInput = forwardRef(CompatBaseDateInputImpl);
