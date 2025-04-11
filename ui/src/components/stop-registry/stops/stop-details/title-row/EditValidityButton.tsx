import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopWithDetails } from '../../../../../types';

const DISABLE_UNTIL_IMPLEMENTED = true;

const testIds = {
  button: 'StopTitleRow::editValidityButton',
};

type EditValidityButtonProps = {
  readonly className?: string;
  readonly stop: StopWithDetails | null;
};

export const EditValidityButton: FC<EditValidityButtonProps> = ({
  className,
  stop,
}) => {
  return (
    // TODO: Add proper accessibility when adding actual implementation.
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <button
      className={twMerge(
        'h-11 w-11',
        'flex items-center justify-center',
        'rounded-full border border-grey',
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        className,
      )}
      data-testid={testIds.button}
      disabled={!stop || DISABLE_UNTIL_IMPLEMENTED}
      type="button"
    >
      <i className="icon-calendar aria-hidden text-2xl text-brand" />
    </button>
  );
};
