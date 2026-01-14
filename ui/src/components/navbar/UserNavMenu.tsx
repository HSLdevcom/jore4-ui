import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twJoin, twMerge } from 'tailwind-merge';
import { LOGIN_URL, LOGOUT_URL } from '../../api/user';
import { useAppSelector } from '../../hooks';
import { selectUser } from '../../redux';
import { NavigationDropdownMenu } from './NavigationDropdownMenu';
import { NavigationDropdownMenuLinkOut } from './NavigationDropdownMenuItem';

type UserNavMenuProps = {
  readonly className?: string;
};

export const testIds = {
  toggleDropdown: 'UserNavMenu::toggleDropdown',
  loginButton: 'UserNavMenu::loginButton',
  logoutButton: 'UserNavMenu::logoutButton',
};

export const UserNavMenu: FC<UserNavMenuProps> = ({ className }) => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation();

  const userIcon = <i className="icon-person text-3xl" />;

  if (!userInfo) {
    return (
      <div className={twMerge('flex items-stretch self-stretch', className)}>
        <a
          href={LOGIN_URL}
          className="mx-4 flex items-center border-b-4 border-transparent text-white hover:border-white focus:outline-hidden"
          data-testid={testIds.loginButton}
        >
          {userIcon}
        </a>
      </div>
    );
  }

  return (
    <NavigationDropdownMenu
      className={twJoin(
        'self-stretch text-white hover:bg-brand-darker',
        className,
      )}
      buttonContent={
        <>
          {userIcon}
          {userInfo.givenName}
        </>
      }
      testId={testIds.toggleDropdown}
    >
      <NavigationDropdownMenuLinkOut
        href={LOGOUT_URL}
        testId={testIds.logoutButton}
      >
        {t('navigation.logout')}
      </NavigationDropdownMenuLinkOut>
    </NavigationDropdownMenu>
  );
};
