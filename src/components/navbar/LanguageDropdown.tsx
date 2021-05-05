import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

export const testIds = {
  openDropdown: 'languageDropdown:openDropdown',
};

interface Props {
  className?: string;
}

export const LanguageDropdown: FunctionComponent<Props> = ({ className }) => {
  const { i18n } = useTranslation();
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
              className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
              data-testid={testIds.openDropdown}
            >
              {currentLanguageText}
              <img
                src="/icons/chevron-down.png"
                className={`ml-2 h-1.5 transform transition duration-150 ease-in-out ${
                  open ? '-rotate-180' : 'rotate-0'
                }`}
                alt=""
              />
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
                className="absolute right-0 w-full bg-brand border-t border-black border-opacity-20 rounded-b-md focus:outline-none shadow-md origin-top-right"
              >
                <div className="my-4">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-brand-darker !rounded-none' : ''
                        } group rounded-md items-center text-center w-full px-4 py-2  focus:outline-none`}
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
