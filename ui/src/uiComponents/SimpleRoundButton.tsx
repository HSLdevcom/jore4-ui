import { FC } from 'react';
import { twJoin } from 'tailwind-merge';
import { SimpleButton, SimpleButtonProps } from './SimpleButton';

/**
 * Creates a round button that fills the available height.
 * In some cases you might need to use `containerClassName='h-auto'` to get the height fill as intended.
 * Typically used with a single icon element as a child.
 */
export const SimpleRoundButton: FC<SimpleButtonProps> = ({ ...props }) => (
  <SimpleButton
    {...props} // eslint-disable-line react/jsx-props-no-spreading
    containerClassName={twJoin('justify-center', props.containerClassName)}
    className={twJoin(
      'flex aspect-square items-center justify-center p-0',
      props.className,
    )}
  />
);
