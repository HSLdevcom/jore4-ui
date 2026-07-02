import { FC } from 'react';
import { BrandLogo } from './BrandLogo';
import { LanguageDropdown } from './LanguageDropdown';
import { LoggedIn } from './LoggedIn';
import { NavLinks } from './NavLinks';
import { UserNavMenu } from './UserNavMenu';

const navMenuStyles = 'border-l border-black/20';

export const Navbar: FC = () => {
  return (
    <nav className="flex flex-row items-center bg-brand">
      <BrandLogo className="my-3.5 pr-5" style={{ marginLeft: 29 }} />
      <LoggedIn>
        <NavLinks />
      </LoggedIn>
      <div className="grow" />
      <UserNavMenu className={navMenuStyles} />
      <LanguageDropdown className={navMenuStyles} />
    </nav>
  );
};
