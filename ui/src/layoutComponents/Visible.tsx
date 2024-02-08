import React from 'react';

interface Props {
  // This visible parameter has to be required, but the value can be undefined.
  visible: boolean | undefined;
  children: JSX.Element | JSX.Element[];
  identifier?: string;
}

/*
 * Convenience component for conditionally hiding components with pure JSX
 * `<Visible show={myBooleanFlag}><MyComponent /></Visible>` is
 * same as `{myBooleanFlag && <MyComponent />}`, but this might
 * be easier to read if there are multiple children components.
 */
export const Visible: React.FC<Props> = ({
  visible = false,
  identifier,
  children,
}) => {
  return visible ? <div id={identifier}>{children}</div> : null;
};
