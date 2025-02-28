import React, { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

// appends a classname to an existing react element
export const addClassName = (element: ReactElement, newClassNames: string) => {
  return React.cloneElement(element, {
    className: twMerge(element.props.className, newClassNames),
  });
};
