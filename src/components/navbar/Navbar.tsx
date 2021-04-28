import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageDropdown } from './LanguageDropdown';
import { NavLinks } from './NavLinks';

export const Navbar: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <nav className="flex flex-row bg-brand items-center">
      <Link to="/" aria-label={t('routes.root')}>
        <img
          src="/nav-logo.svg"
          style={{ height: 40, marginLeft: 29 }}
          alt=""
          className="pr-5"
        />
      </Link>
      <NavLinks />
      <LanguageDropdown className="ml-auto" />
    </nav>
  );
};
