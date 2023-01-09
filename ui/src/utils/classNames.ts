interface ButtonClassNames {
  commonClassNames: string;
  colorClassNames: string;
  invertedColorClassNames: string;
  hoverClassNames?: string;
  invertedHoverClassNames?: string;
  disabledClassNames?: string;
}

export const buildGetButtonClassNamesFunction =
  ({
    commonClassNames = '',
    colorClassNames = '',
    invertedColorClassNames = '',
    hoverClassNames = '',
    invertedHoverClassNames = '',
    disabledClassNames = 'cursor-not-allowed opacity-70',
  }: ButtonClassNames) =>
  (disabled = false, inverted = false) => {
    const getHoverStyles = () => {
      if (disabled) {
        return '';
      }

      return inverted ? invertedHoverClassNames : hoverClassNames;
    };

    const colorStyles = inverted ? invertedColorClassNames : colorClassNames;

    const disabledStyles = disabled ? disabledClassNames : '';

    return `${commonClassNames} ${colorStyles} ${disabledStyles} ${getHoverStyles()}`;
  };
