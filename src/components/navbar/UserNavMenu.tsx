import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL, LOGOUT_URL } from '../../api/user';
import { useUserContext } from '../../context/UserContext';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  className?: string;
}

export const UserNavMenu: FunctionComponent<Props> = ({ className }) => {
  const userContext = useUserContext();
  const { t } = useTranslation();

  const userImgElement = (
    <img
      src="/icons/user.svg"
      alt={t('navigation.user')}
      className="ml-2 mr-2 h-5"
    />
  );

  return (
    <div
      className={`text-white self-stretch hover:bg-brand-darker ${className}`}
    >
      {!userContext.loggedIn ? (
        <a
          href={LOGIN_URL}
          className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
        >
          {userImgElement}
        </a>
      ) : (
        <DropdownMenu
          buttonContent={
            <>
              {userImgElement}
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
