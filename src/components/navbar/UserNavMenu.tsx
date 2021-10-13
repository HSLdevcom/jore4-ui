import React from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL, LOGOUT_URL } from '../../api/user';
import { useUserContext } from '../../context/UserContext';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  className?: string;
}

export const UserNavMenu = ({ className }: Props): JSX.Element => {
  const userContext = useUserContext();
  const { t } = useTranslation();

  const userIcon = <i className="icon-person text-3xl" />;

  return (
    <div
      className={`text-white self-stretch z-10 hover:bg-brand-darker ${className}`}
    >
      {!userContext.loggedIn ? (
        <a
          href={LOGIN_URL}
          className="flex items-center mx-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
        >
          {userIcon}
        </a>
      ) : (
        <DropdownMenu
          buttonContent={
            <>
              {userIcon}
              {userContext.userInfo?.givenName}
            </>
          }
        >
          <a href={LOGOUT_URL} className="block">
            {t('navigation.logout')}
          </a>
        </DropdownMenu>
      )}
    </div>
  );
};
