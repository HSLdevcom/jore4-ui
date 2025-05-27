import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { SimpleButton, SimpleButtonProps } from '../../../../../uiComponents';

export const SlimSimpleButton: FC<SimpleButtonProps> = ({ ...props }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <SimpleButton {...props} className={twMerge(props.className, 'py-1')} />
);
