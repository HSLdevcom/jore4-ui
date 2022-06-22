import React, { ReactElement } from 'react';

// appends a classname to an existing react element
export const addClassName = (element: ReactElement, newClassName: string) => {
  const className = element.props.className
    ? `${element.props.className} ${newClassName}`
    : newClassName;

  const childProps = {
    className,
  };

  return React.cloneElement(element, childProps);
};
