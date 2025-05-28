import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { routeDetails } from '../../router/routeDetails';

const testIds = {
  navLink: (translationKey?: string) => `NavLinks::${translationKey}`,
};

export const NavLinks: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      {Object.values(routeDetails)
        .filter((item) => item.includeInNav)
        .map(({ translationKey, getLink }) => (
          <div key={translationKey} className="flex hover:bg-brand-darker">
            <NavLink
              to={getLink()}
              className={({ isActive }) =>
                `mx-5 border-b-4 border-transparent py-5 text-white hover:border-white ${
                  isActive ? '!border-white' : ''
                }`
              }
              data-testid={testIds.navLink(translationKey)}
              end
            >
              {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
              {t(translationKey!)}
            </NavLink>
          </div>
        ))}
    </>
  );
};
