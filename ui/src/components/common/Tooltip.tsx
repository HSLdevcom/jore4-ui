interface Props {
  message: string;
  tooltipClassName?: string;
}

/**
 * Adds tooltip for hovering over children. Give delay and position via className
 * Example:
 * <Tooltip className="bottom-11 delay-700" message="Tooltip message">
 *   ...
 * </Tooltip>
 */
export const Tooltip: React.FC<Props> = ({
  message,
  tooltipClassName = '',
  children,
}) => {
  return (
    <div className="group relative flex justify-center">
      <span
        className={`absolute z-10 w-max scale-0 rounded-md bg-dark-grey p-2 text-xs 
        text-white transition-all group-hover:scale-100 ${tooltipClassName}`}
      >
        {message}
      </span>
      {children}
    </div>
  );
};
