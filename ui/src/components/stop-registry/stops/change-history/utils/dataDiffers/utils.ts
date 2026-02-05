import { ReactNode } from 'react';

export function optionalFmt(
  fmt: Intl.NumberFormat,
): (v: number | null | undefined) => ReactNode {
  return (v) => {
    if (v === null || v === undefined) {
      return null;
    }

    return fmt.format(v);
  };
}
