import React from 'react';
import { useTranslation } from 'react-i18next';
import { LOGIN_URL, LOGOUT_URL } from '../../api/user';
import { useAppSelector } from '../../hooks';
import { selectUser } from '../../redux';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  className?: string;
}

export const UserNavMenu = ({ className }: Props): JSX.Element => {
  const { userInfo } = useAppSelector(selectUser);
  const { t } = useTranslation();

  const userIcon = <i className="icon-person text-3xl" />;

  return (
    <div
      className={`z-10 self-stretch text-white hover:bg-brand-darker ${className}`}
    >
      {!userInfo ? (
        <a
          href={LOGIN_URL}
          className="mx-3 flex h-full items-center border-b-4 border-transparent hover:border-white focus:outline-none"
        >
          {userIcon}
        </a>
      ) : (
        <DropdownMenu
          buttonContent={
            <>
              {userIcon}
              {userInfo.givenName}
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
