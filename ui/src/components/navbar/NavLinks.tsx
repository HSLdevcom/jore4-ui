import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { routeDetails } from '../../router/routeDetails';

const testIds = {
  navLink: (translationKey?: string) => `NavLinks::${translationKey}`,
};

export const NavLinks: FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <>
      {Object.values(routeDetails)
        .filter((item) => item.includeInNav)
        .map(({ translationKey, getLink }) => (
          <div key={translationKey} className="flex hover:bg-brand-darker">
            <NavLink
              to={getLink()}
              className="mx-5 border-b-4 border-transparent py-5 text-white hover:border-white"
              activeClassName="!border-white"
              data-testid={testIds.navLink(translationKey)}
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
