import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';
import { routes } from '../routes';

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
      {Object.values(routes)
        .filter((item) => item.includeInNav)
        .map(({ translationKey, getLink }) => (
          <div key={translationKey} className="flex hover:bg-brand-darker">
            <NavLink
              to={getLink()}
              className="py-5 mx-5 text-white border-b-4 border-transparent hover:border-white"
              activeClassName="!border-white"
              exact
            >
              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
              {t(translationKey!)}
            </NavLink>
          </div>
        ))}
    </nav>
  );
};
