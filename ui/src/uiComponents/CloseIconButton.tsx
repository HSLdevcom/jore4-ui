interface Props {
  onClick: () => void;
  className?: string;
  label?: string;
  testId: string;
}

export const CloseIconButton = ({
  onClick,
  className = '',
  label,
  testId,
}: Props): JSX.Element => {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      data-testid={testId}
    >
      {label}
      <i className="icon-close-large ml-4 text-lg" />
    </button>
  );
};
