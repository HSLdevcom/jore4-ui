import { Menu, Transition } from '@headlessui/react';
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { login, logout } from '../../api/user';
import { useTypedSelector } from '../../redux/store';

export const testIds = {
  openDropdown: 'userDropdown:openDropdown',
};

interface Props {
  className?: string;
}

export const UserDropdown: FunctionComponent<Props> = ({ className }) => {
  const userInfo = useTypedSelector(state => state.user.userInfo);

  return (
    <div
      className={`text-white self-stretch hover:bg-brand-darker ${className}`}
    >
      <Menu as="div" className="relative h-full">
        {({ open }) => (
          <>
            {!userInfo ?
              <NavLink
                className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
                data-testid={testIds.openDropdown}
                onClick={() => { login() }}
                to=""
              >
                <img
                  src="/icons/user.svg"
                  alt="user"
                  className="ml-2 mr-2 h-5"
                />
              </NavLink>
              :
              <Menu.Button
                className="flex items-center mx-4 px-3 h-full border-b-4 border-transparent hover:border-white focus:outline-none"
                data-testid={testIds.openDropdown}
              >
                <img
                  src="/icons/user.svg"
                  alt="user"
                  className="ml-2 mr-2 h-5"
                />
                {userInfo.given_name}
                <img
                  src="/icons/chevron-down.png"
                  className={`ml-2 h-1.5 transform transition duration-150 ease-in-out ${
                    open ? '-rotate-180' : 'rotate-0'
                  }`}
                  alt=""
                />
              </Menu.Button>
            }
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
                    <button
                      className="group rounded-md items-center text-center w-full px-4 py-2 focus:outline-none"
                      type="button"
                      onClick={() => { logout() }}
                    >
                      Kirjaudu ulos
                    </button>
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
