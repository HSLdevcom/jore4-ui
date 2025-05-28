import { FC } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { commonHoverStyle } from './SimpleButton';

type LinkProps = {
  readonly href: string;
};

type ButtonProps = {
  readonly onClick: () => void;
};

type CommonProps = {
  readonly testId?: string;
  readonly tooltip: string;
  readonly className?: string;
};

type EditButtonProps = CommonProps & (LinkProps | ButtonProps);

const ButtonContent = () => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded-full border border-grey bg-white ${commonHoverStyle}`}
  >
    <MdModeEdit className="aria-hidden text-2xl text-tweaked-brand" />
  </div>
);

export const EditButton: FC<EditButtonProps> = (props) => {
  const { testId, tooltip, className = '' } = props;
  const href = (props as LinkProps)?.href;
  const onClick = (props as ButtonProps)?.onClick;

  if (href) {
    return (
      <Link
        to={href}
        data-testid={testId}
        title={tooltip}
        className={twMerge('ml-5 rounded-full', className)}
      >
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type="button"
      data-testid={testId}
      title={tooltip}
      className={twMerge('ml-5 rounded-full', className)}
    >
      <ButtonContent />
    </button>
  );
};
