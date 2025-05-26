import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from './DropdownMenu';

export const testIds = {
  toggleDropdown: 'LanguageDropdown::toggleDropdown',
  toggleLanguage: 'LanguageDropdown::toggleLanguage',
};

type LanguageDropdownProps = {
  readonly className?: string;
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({
  className = '',
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  // TODO: this is is naive implementation and won't work if we have more than 2 supported languages at some point
  const anotherLanguage = currentLanguage === 'fi-FI' ? 'en-US' : 'fi-FI';
  // These are not translated on purpose. Now this seems to work like https://www.hsl.fi/ does.
  const currentLanguageText = currentLanguage === 'fi-FI' ? 'FI' : 'EN';
  const changeLanguageText = currentLanguage === 'fi-FI' ? 'EN' : 'FI';

  return (
    <div
      className={`z-10 self-stretch text-white hover:bg-brand-darker ${className}`}
    >
      <DropdownMenu
        buttonContent={currentLanguageText}
        testId={testIds.toggleDropdown}
      >
        <button
          type="button"
          onClick={() => i18n.changeLanguage(anotherLanguage)}
          data-testid={testIds.toggleLanguage}
        >
          {changeLanguageText}
        </button>
      </DropdownMenu>
    </div>
  );
};
