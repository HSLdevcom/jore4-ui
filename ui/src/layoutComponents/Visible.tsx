import { FC, PropsWithChildren } from 'react';

type VisibleProps = {
  // This visible parameter has to be required, but the value can be undefined.
  readonly visible: boolean | undefined;
};

/*
 * Convenience component for conditionally hiding components with pure JSX
 * `<Visible show={myBooleanFlag}><MyComponent /></Visible>` is
 * same as `{myBooleanFlag && <MyComponent />}`, but this might
 * be easier to read if there are multiple children components.
 */
export const Visible: FC<PropsWithChildren<VisibleProps>> = ({
  visible = false,
  children,
}) => {
  return visible ? children : null;
};
