import { Popover } from '../../uiComponents';

interface Props {
  title: string;
  description: string;
  onClose: () => void;
}

export const AlertPopover = ({
  title,
  description,
  onClose,
}: Props): JSX.Element => {
  return (
    <Popover
      className="z-20 ml-10 border-black bg-white drop-shadow-md"
      onClose={onClose}
    >
      <div className="mb-1 space-x-3">
        <h5 className="inline text-lg">{title}</h5>
      </div>
      <p className=" text-sm">{description}</p>
    </Popover>
  );
};
