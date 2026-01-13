import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin } from 'tailwind-merge';
import { NavigationDropdownMenu } from './NavigationDropdownMenu';
import { NavigationDropdownMenuButton } from './NavigationDropdownMenuItem';

export const testIds = {
  toggleDropdown: 'LanguageDropdown::toggleDropdown',
  toggleLanguage: 'LanguageDropdown::toggleLanguage',
};

type LanguageDropdownProps = {
  readonly className?: string;
};

export const LanguageDropdown: FC<LanguageDropdownProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  // TODO: this is is naive implementation and won't work if we have more than 2 supported languages at some point
  const anotherLanguage = currentLanguage === 'fi-FI' ? 'en-US' : 'fi-FI';
  // These are not translated on purpose. Now this seems to work like https://www.hsl.fi/ does.
  const currentLanguageText = currentLanguage === 'fi-FI' ? 'FI' : 'EN';
  const changeLanguageText = currentLanguage === 'fi-FI' ? 'EN' : 'FI';

  return (
    <NavigationDropdownMenu
      className={twJoin(
        'self-stretch text-white hover:bg-brand-darker',
        className,
      )}
      buttonContent={currentLanguageText}
      testId={testIds.toggleDropdown}
    >
      <NavigationDropdownMenuButton
        onClick={() => i18n.changeLanguage(anotherLanguage)}
        testId={testIds.toggleLanguage}
      >
        {changeLanguageText}
      </NavigationDropdownMenuButton>
    </NavigationDropdownMenu>
  );
};
