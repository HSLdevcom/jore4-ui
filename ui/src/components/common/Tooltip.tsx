import { FC, PropsWithChildren } from 'react';

type TooltipProps = {
  readonly message: string;
  readonly tooltipClassName?: string;
};

/**
 * Adds tooltip for hovering over children. Give delay and position via className
 * Example:
 * <Tooltip className="bottom-11 delay-700" message="Tooltip message">
 *   ...
 * </Tooltip>
 * As of Jan 2024, not in active use anymore.
 * There are designs for such an element to show extra information for Timing Points.
 */
export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({
  message,
  tooltipClassName = '',
  children,
}) => {
  return (
    <div className="group relative flex justify-center">
      <span
        className={`absolute z-10 w-max scale-0 rounded-md bg-dark-grey p-2 text-xs text-white transition-all group-hover:scale-100 ${tooltipClassName}`}
      >
        {message}
      </span>
      {children}
    </div>
  );
};
