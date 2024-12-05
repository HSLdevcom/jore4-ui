export type CalendarButtonProps = {
  name: string;
  onClick: () => void;
};

export const CalendarButton = (props: CalendarButtonProps) => {
  const { name, onClick } = props;
  return (
    <div className="ml-3 rounded-[3px] border border-light-grey bg-white p-2">
      <div
        tabIndex={0}
        data-testid={`calendar-button-${name}`}
        aria-label={`calendar-button-${name}`}
        role="button"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onClick();
          }
        }}
      >
        <i className="icon-calendar text-lg" />
      </div>
    </div>
  );
};
