import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, FunctionComponent } from 'react';
import { i18n } from '../../i18n';

export const testIds = {
  openDropdown: 'languageDropdown:openDropdown',
};

interface Props {
  className?: string;
}

export const LanguageDropdown: FunctionComponent<Props> = ({ className }) => {
  const currentLanguage = i18n.language;
  // TODO: this is is naive implementation and won't work if we have more than 2 supported languages at some point
  const anotherLanguage = currentLanguage === 'fi-FI' ? 'en-US' : 'fi-FI';
  // These are not translated on purpose. Now this seems to work like https://www.hsl.fi/ does.
  const currentLanguageText = currentLanguage === 'fi-FI' ? 'FI' : 'EN';
  const changeLanguageText = currentLanguage === 'fi-FI' ? 'EN' : 'FI';

  return (
    <div
      className={`text-white self-stretch hover:bg-brand-darker ${className}`}
    >
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            <Menu.Button
              className="h-full border-b-4 border-transparent hover:border-white mx-4 px-3 focus:outline-none"
              data-testid={testIds.openDropdown}
            >
              {currentLanguageText}
            </Menu.Button>
            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-full origin-top-right bg-brand rounded-b-md shadow-md border-green-500 border-t border-opacity-20 focus:outline-none"
              >
                <div className="my-4 ">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-brand-darker' : ''
                        } group rounded-md items-center text-center w-full px-4 py-2 focus:outline-none`}
                        type="button"
                        onClick={() => i18n.changeLanguage(anotherLanguage)}
                      >
                        {changeLanguageText}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};
