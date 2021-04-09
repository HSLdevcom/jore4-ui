import { useTranslation } from 'react-i18next';
import { i18n } from '../i18n';

export const SimpleLanguageChooser = (): JSX.Element => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  // TODO: this is is naive implementation and won't work if we have more than 2 supported languages at some points
  const anotherLanguage = currentLanguage === 'fi-FI' ? 'en-US' : 'fi-FI';
  const changeLanguageText =
    currentLanguage === 'fi-FI' ? t('languages.en-US') : t('languages.fi-FI');
  return (
    <div>
      <p>{t('chooseLanguage')}</p>
      <button
        type="button"
        onClick={() => i18n.changeLanguage(anotherLanguage)}
      >
        {changeLanguageText}
      </button>
    </div>
  );
};
