import { FunctionComponent } from 'react';
import { LoggedIn } from '../../layoutComponents/LoggedIn';
import { BrandLogo } from './BrandLogo';
import { LanguageDropdown } from './LanguageDropdown';
import { NavLinks } from './NavLinks';
import { UserNavMenu } from './UserNavMenu';

const navMenuStyles = 'border-l border-black border-opacity-20';

export const Navbar: FunctionComponent = () => {
  return (
    <nav className="flex flex-row items-center bg-brand">
      <BrandLogo className="pr-5" style={{ marginLeft: 29 }} />
      <LoggedIn>
        <NavLinks />
      </LoggedIn>
      <UserNavMenu className={`${navMenuStyles} ml-auto`} />
      <LanguageDropdown className={navMenuStyles} />
    </nav>
  );
};
