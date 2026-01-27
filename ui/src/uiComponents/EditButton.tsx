import { FC } from 'react';
import { MdModeEdit } from 'react-icons/md';
import { Link } from 'react-router';
import { twMerge } from 'tailwind-merge';

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
  <MdModeEdit aria-hidden className="text-2xl text-tweaked-brand" />
);

export const EditButton: FC<EditButtonProps> = (props) => {
  const { testId, tooltip, className } = props;
  const href = (props as LinkProps)?.href;
  const onClick = (props as ButtonProps)?.onClick;

  const classNames = twMerge(
    'ml-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-grey bg-white',
    'hover:enabled:border-tweaked-brand enabled:hover:outline-tweaked-brand',
    className,
  );

  if (href) {
    return (
      <Link
        to={href}
        data-testid={testId}
        title={tooltip}
        className={classNames}
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
      className={classNames}
    >
      <ButtonContent />
    </button>
  );
};
