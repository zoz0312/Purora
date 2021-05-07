import poro from "@image/poro.jpg";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import {Disclosure, Menu, Transition} from "@headlessui/react";
import {MenuIcon, XIcon} from "@heroicons/react/outline";
import {NavigationMenu, NavigationProps} from "@components/layout/login-layout";
import {classNames} from "@utils/functions";


const Navigation: React.FC<NavigationProps> = (
  {
    navigation,
    profile,
    pathname,
    open,
  }
) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8"
              src={poro}
              alt="Poro"
            />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map(({host, name}, itemIdx) =>
                host === pathname ? (
                  <Fragment key={itemIdx}>
                    <Link to={'#'} href="#" className="bg-personal-3 text-white px-3 py-2 rounded-md text-sm font-medium">
                      {name}
                    </Link>
                  </Fragment>
                ) : (
                  <Link
                    to={host}
                    key={itemIdx}
                    className="text-gray-100 bg-personal-2 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >{name}</Link>
                )
              )}
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="ml-4 flex items-center md:ml-6">
            {/*
              <button className="bg-personal-2 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>
             */}
            {/* Profile dropdown */}
            <Menu as="div" className="ml-3 relative">
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="max-w-xs bg-personal-2 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-personal-3 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </Menu.Button>
                  </div>
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
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {profile.map(({ host, name}, profileIdx) => (
                        <Menu.Item key={profileIdx}>
                          {({ active }) => (
                            <Link
                              to={host}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700'
                              )}
                            >{name}</Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </div>
        <div className="-mr-2 flex md:hidden">
          {/* Mobile menu button */}
          <Disclosure.Button className="bg-personal-2 inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-personal-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-personal-3 focus:ring-white">
            <span className="sr-only">Open main menu</span>
            {open ? (
              <XIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <MenuIcon className="block h-6 w-6" aria-hidden="true" />
            )}
          </Disclosure.Button>
        </div>
      </div>
    </div>
  )
}

export default Navigation;
