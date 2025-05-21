interface Props {
  affectedRouteLabels: ReadonlyArray<string>;
  text: string;
}

export const AffectedRouteLabels = ({
  affectedRouteLabels,
  text,
}: Props): React.ReactElement => {
  return (
    <div className="my-6 flex flex-row items-center space-x-6">
      <i className="icon-alert text-hsl-red" />
      <div className="space-y-1 text-sm">
        <p className="font-bold">{text}</p>
        <p>{affectedRouteLabels.join(', ')}</p>
      </div>
    </div>
  );
};
