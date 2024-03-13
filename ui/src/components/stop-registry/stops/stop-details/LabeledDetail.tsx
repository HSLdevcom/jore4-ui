interface Props {
  title: string;
  detail: string | null | undefined;
  className?: string;
}
export const LabeledDetail = ({
  title,
  detail,
  className = '',
}: Props): JSX.Element => {
  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="text-sm">{title}</div>
      <div className="text-sm font-bold">{detail || '-'}</div>
    </div>
  );
};
