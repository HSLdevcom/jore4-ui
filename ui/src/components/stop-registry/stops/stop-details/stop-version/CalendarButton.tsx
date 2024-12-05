type CalendarButtonProps = {
  readonly name: string;
  readonly onClick: () => void;
};

export const CalendarButton = (props: CalendarButtonProps) => {
  const { name, onClick } = props;
  return (
    <div className="ml-3 rounded-[3px] border border-light-grey bg-white p-2">
      <button
        type="button"
        data-testid={`calendar-button-${name}`}
        onClick={onClick}
      >
        <i className="icon-calendar text-lg" />
      </button>
    </div>
  );
};
