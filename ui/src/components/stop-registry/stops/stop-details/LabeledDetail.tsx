interface Props<T> {
  title: string;
  detail: T | null | undefined;
  className?: string;
}
export const LabeledDetail = <T extends ExplicitAny>({
  title,
  detail,
  className = '',
}: Props<T>): JSX.Element => {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="text-sm">{title}</div>
      <div className="text-sm font-bold">{detail ?? '-'}</div>
    </div>
  );
};
