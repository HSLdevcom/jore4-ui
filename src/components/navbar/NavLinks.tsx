import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routes } from '../../routes';

export const NavLinks: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      {Object.values(routes)
        .filter((item) => item.includeInNav)
        .map(({ translationKey, getLink }) => (
          <div key={translationKey} className="flex hover:bg-brand-darker">
            <NavLink
              to={getLink()}
              className="mx-5 py-5 text-white border-b-4 border-transparent hover:border-white"
              activeClassName="!border-white"
              exact
            >
              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
              {t(translationKey!)}
            </NavLink>
          </div>
        ))}
    </>
  );
};
