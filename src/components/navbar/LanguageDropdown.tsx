import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { DropdownMenu } from './DropdownMenu';

export const testIds = {
  openDropdown: 'languageDropdown:openDropdown',
};

interface Props {
  className?: string;
}

export const LanguageDropdown: FunctionComponent<Props> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  // TODO: this is is naive implementation and won't work if we have more than 2 supported languages at some point
  const anotherLanguage = currentLanguage === 'fi-FI' ? 'en-US' : 'fi-FI';
  // These are not translated on purpose. Now this seems to work like https://www.hsl.fi/ does.
  const currentLanguageText = currentLanguage === 'fi-FI' ? 'FI' : 'EN';
  const changeLanguageText = currentLanguage === 'fi-FI' ? 'EN' : 'FI';

  return (
    <div
      className={`text-white self-stretch z-10 hover:bg-brand-darker ${className}`}
    >
      <DropdownMenu
        buttonContent={currentLanguageText}
        testId={testIds.openDropdown}
      >
        <button
          type="button"
          onClick={() => i18n.changeLanguage(anotherLanguage)}
        >
          {changeLanguageText}
        </button>
      </DropdownMenu>
    </div>
  );
};
