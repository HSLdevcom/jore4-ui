import { ReactElement, cloneElement } from 'react';
import { twMerge } from 'tailwind-merge';

// appends a classname to an existing react element
export const addClassName = (element: ReactElement, newClassNames: string) => {
  return cloneElement(element, {
    className: twMerge(element.props.className, newClassNames),
  });
};
