import {NavigationProps} from "@components/layout/login-layout";
import React, {Fragment} from "react";
import {Link} from "react-router-dom";
import {Disclosure} from "@headlessui/react";

const NavigationMobile: React.FC<NavigationProps> = (
  {
    navigation,
    profile,
    pathname,
    open,
  }
) => {
  return (
    <Disclosure.Panel className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navigation.map(({host, name}, itemIdx) =>
          host === pathname ? (
            <Fragment key={itemIdx}>
              <Link
                to={'#'}
                href="#"
                className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              >{name}</Link>
            </Fragment>
          ) : (
            <Link
              to={host}
              key={itemIdx}
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >{name}</Link>
          )
        )}
      </div>
      <div className="pt-4 pb-3 border-t border-gray-700">
        <div className="flex items-center px-5">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div className="ml-3">
            <div className="text-base font-medium leading-none text-white">Tom Cook</div>
            <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
          </div>
          {/*
            <button className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            */}
        </div>
        <div className="mt-3 px-2 space-y-1">
          {profile.map(({ host, name }, idx) => (
            <Link
              to={host}
              key={idx}
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
            >{name}</Link>
          ))}
        </div>
      </div>
    </Disclosure.Panel>
  )
}

export default NavigationMobile;