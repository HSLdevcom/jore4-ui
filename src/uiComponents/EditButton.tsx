import React from 'react';
import { MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface LinkProps {
  href: string;
}

interface ButtonProps {
  onClick: () => void;
}
interface CommonProps {
  testId?: string;
}

type Props = CommonProps & (LinkProps | ButtonProps);

const ButtonContent = () => (
  <div className="ml-5 h-10 w-10 rounded-full border border-grey bg-white">
    <MdModeEdit className="m-2 text-2xl text-tweaked-brand" />
  </div>
);

export const EditButton: React.FC<Props> = (props) => {
  const { testId } = props;
  const href = (props as LinkProps)?.href;
  const onClick = (props as ButtonProps)?.onClick;

  if (href) {
    return (
      <Link to={href} data-testid={testId}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" data-testid={testId}>
      <ButtonContent />
    </button>
  );
};
