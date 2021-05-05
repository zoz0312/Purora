import React, {useState} from 'react';
import poro from "@image/poro.jpg";
import { Link, useLocation } from "react-router-dom";
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import Navigation from "@components/layout/navigation";
import NavigationMobile from "@components/layout/navigation-mobile";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";

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
    name: 'Home',
    host: '/',
  },
  {
    name: '내 소환사',
    host: '/my/summoner',
  },
];

const profile: NavigationMenu[] = [
  {
    name: '내 정보',
    host: '/my/profile',
  },
];

interface LoginLayoutProps extends AuthStateType, AuthDispatchType {};

const LoginLayout: React.FC<LoginLayoutProps> = (
  {
    children,
    user,
    token,
  }
) => {
  let { pathname } = useLocation();

  console.log('location', useLocation())
  const curHeader = navigation.find(({ host, name }) => host === pathname);

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
      <header className="bg-white shadow">
        { curHeader && (
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              { curHeader.name }
            </h1>
          </div>
        )}
      </header>
      { children }
    </div>
  )
}

export default connect(authMapStateToProps,authMapDispatchToProps)(LoginLayout);