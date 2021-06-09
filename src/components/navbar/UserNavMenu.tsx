import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { login, logout } from '../../api/user';
import { useUserContext } from '../../context/UserContext';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  className?: string;
}

export const UserNavMenu: FunctionComponent<Props> = ({ className }) => {
  const userContext = useUserContext();
  const { t } = useTranslation();

  const userImgElement = (
    <img src="/icons/user.svg" alt="user" className="ml-2 mr-2 h-5" />
  );

  return (
    <div
      className={`text-white self-stretch hover:bg-brand-darker ${className}`}
    >
      {!userContext.loggedIn ? (
        <NavLink
          className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
          onClick={() => {
            login();
          }}
          to=""
        >
          {userImgElement}
        </NavLink>
      ) : (
        <DropdownMenu
          buttonContent={
            <>
              {userImgElement}
              {userContext.userInfo.given_name}
            </>
          }
        >
          <button
            type="button"
            onClick={() => {
              logout();
            }}
          >
            {t('navigation.logout')}
          </button>
        </DropdownMenu>
      )}
    </div>
  );
};
