import { useTranslation } from 'react-i18next';
import { theme } from '../../../generated/theme';

const testIds = {
  notValidText: 'LineNotValidForDayBox::notValidText',
};
export const LineNotValidForDayBox = () => {
  const { t } = useTranslation();
  const { colors } = theme;
  const grayBackground = `bg-[${colors.background.grey}]`;
  const redText = `text-[${colors.hslRed}]`;
  return (
    <div
      className={`justify-center] flex h-[309px] w-[928px] items-center justify-center ${grayBackground}`}
    >
      <span className={`icon-alert p-2 ${redText}`} />
      <p data-testid={testIds.notValidText} className="self-center">
        {t('lines.lineNotValidForDay')}
      </p>
    </div>
  );
};
