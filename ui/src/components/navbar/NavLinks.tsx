import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { twMerge } from 'tailwind-merge';
import { isNavigationRoute, routeDetails } from '../../router/routeDetails';

const testIds = {
  navLink: (translationKey?: string) => `NavLinks::${translationKey}`,
};

export const NavLinks: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {Object.values(routeDetails)
        .filter(isNavigationRoute)
        .map(({ translationKey, getLink }) => (
          <div key={translationKey} className="flex hover:bg-brand-darker">
            <NavLink
              to={getLink()}
              className={({ isActive }) =>
                twMerge(
                  'mx-5 border-b-4 border-transparent py-5 text-white hover:border-white',
                  isActive && 'border-white',
                )
              }
              data-testid={testIds.navLink(translationKey)}
              end
            >
              {t(translationKey)}
            </NavLink>
          </div>
        ))}
    </>
  );
};
