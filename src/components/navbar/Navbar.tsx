import React, { FunctionComponent } from 'react';
import { BrandLogo } from './BrandLogo';
import { LanguageDropdown } from './LanguageDropdown';
import { NavLinks } from './NavLinks';
import { UserDropdown } from './UserDropdown';

export const Navbar: FunctionComponent = () => {
  return (
    <nav className="flex flex-row items-center bg-brand">
      <BrandLogo className="pr-5" style={{ marginLeft: 29 }} />
      <NavLinks />
      <UserDropdown className="ml-auto border-l border-black border-opacity-20" />
      <LanguageDropdown className="border-l border-black border-opacity-20" />
    </nav>
  );
};
