import React, {useState} from 'react';
import poro from "@image/poro.jpg";
import { Link, useLocation } from "react-router-dom";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Navigation from "@components/layout/navigation";
import NavigationMobile from "@components/layout/navigation-mobile";

export interface NavigationMenu {
  name: string;
  host: string;
}

export interface NavigationProps {
  navigation: NavigationMenu[];
  profile: NavigationMenu[];
  pathname: string;
  open: boolean;
}

const navigation: NavigationMenu[] = [
  {
    name: 'Dashboard',
    host: '/',
  },
];

const profile: NavigationMenu[] = [
  {
    name: '내 정보',
    host: '/profile',
  },
];

interface LoginLayoutProps {
  user: object;
  token: string;
}

const LoginLayout: React.FC<LoginLayoutProps> = (
  {
    children,
    user,
    token
  }
) => {
  let { pathname } = useLocation();
  // console.log('location', location)

  return (
    <div>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <Navigation
              navigation={navigation}
              profile={profile}
              pathname={pathname}
              open={open}
            />
            <NavigationMobile
              navigation={navigation}
              profile={profile}
              pathname={pathname}
              open={open}
            />
          </>
        )}
      </Disclosure>
      <header>
        Header
      </header>
      { children }
    </div>
  )
}

export default LoginLayout;