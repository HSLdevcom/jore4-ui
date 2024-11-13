import { useTranslation } from 'react-i18next';
import { theme } from '../../../generated/theme';
import { LineFetchError } from '../../../hooks';

const testIds = {
  notValidText: 'LineMissingBox::notValidText',
};
const { colors } = theme;
const grayBackground = `bg-background`;
const redText = `text-hsl-red`;
const border = `border border-${colors.lightGrey}`;

export const LineMissingBox = (props?: { error?: LineFetchError }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`justify-center] flex h-72 w-full flex-shrink-0 items-center justify-center ${grayBackground} ${border}`}
    >
      <span className={`icon-alert p-2 ${redText}`} />
      <p data-testid={testIds.notValidText} className="self-center">
        {t(props?.error ?? LineFetchError.LINE_MISSING_DEFAULT)}
      </p>
    </div>
  );
};
