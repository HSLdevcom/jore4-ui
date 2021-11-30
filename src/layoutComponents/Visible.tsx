import React from 'react';

interface Props {
  visible: boolean;
  children: JSX.Element | JSX.Element[];
}

/*
 * Convenience component for conditionally hiding components with pure JSX
 * `<Visible show={myBooleanFlag}><MyComponent /></Visible>` is
 * same as `{myBooleanFlag && <MyComponent />}`, but this might
 * be easier to read if there are multiple children components.
 */
export const Visible: React.FC<Props> = ({ visible, children }) => {
  return visible ? <>{children}</> : null;
};
