import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from 'react-router-dom';

export const Navbar: FunctionComponent = () => {
  const { t } = useTranslation();
  const routes = [
    {
      title: t('routes.root'),
      path: '/',
    },
    {
      title: 'Example route',
      path: '/example-route',
    },
  ];
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
      {routes.map(({ title, path }) => (
        <div key={path} className="flex hover:bg-brand-darker">
          <NavLink
            to={path}
            className="py-5 mx-5 text-white border-b-4 border-transparent hover:border-white"
            activeClassName="!border-white"
            exact
          >
            {title}
          </NavLink>
        </div>
      ))}
    </nav>
  );
};
