import { ReactElement, TextareaHTMLAttributes, useEffect, useRef } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';

type AutomaticallyResizingTextAreaProps<FormState extends FieldValues> = {
  readonly id: string;
  readonly testId: string;
  readonly fieldPath: Path<FormState>;
} & Readonly<TextareaHTMLAttributes<HTMLTextAreaElement>>;

export const AutomaticallyResizingTextArea = <FormState extends FieldValues>({
  id,
  testId,
  fieldPath,
  ...elementProps
}: AutomaticallyResizingTextAreaProps<FormState>): ReactElement => {
  const { register, watch } = useFormContext<FormState>();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...rest } = register(fieldPath);

  const value = watch(fieldPath);

  const autoResize = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [value]);

  return (
    <textarea
      id={id}
      className="resize-none overflow-hidden leading-tight"
      rows={1}
      data-testid={testId}
      ref={(e) => {
        ref(e);
        textareaRef.current = e;
      }}
      onInput={autoResize}
      {...rest}
      {...elementProps}
    />
  );
};
