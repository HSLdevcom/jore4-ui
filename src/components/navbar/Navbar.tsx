import React, { FunctionComponent } from 'react';
import { BrandLogo } from './BrandLogo';
import { LanguageDropdown } from './LanguageDropdown';
import { NavLinks } from './NavLinks';

export const Navbar: FunctionComponent = () => {
  return (
    <nav className="flex flex-row bg-brand items-center">
      <BrandLogo className="pr-5" style={{ marginLeft: 29 }} />
      <NavLinks />
      <LanguageDropdown className="ml-auto border-black border-l border-opacity-20" />
    </nav>
  );
};
