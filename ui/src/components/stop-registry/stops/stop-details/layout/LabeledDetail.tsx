interface Props<T> {
  title: string;
  detail: T | null | undefined;
  testId?: string;
  className?: string;
}
export const LabeledDetail = <T extends ExplicitAny>({
  title,
  detail,
  testId = '',
  className = '',
}: Props<T>): JSX.Element => {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="text-sm">{title}</div>
      <div className="text-sm font-bold" data-testid={testId}>
        {detail ?? '-'}
      </div>
    </div>
  );
};
