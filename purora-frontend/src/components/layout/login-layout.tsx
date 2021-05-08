import React, {useState} from 'react';
import { Link, useLocation } from "react-router-dom";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import Navigation from "@components/layout/navigation";
import NavigationMobile from "@components/layout/navigation-mobile";
import {AuthDispatchType, authMapDispatchToProps, authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";
import './login-layout.scss';

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
    name: '전체 전적',
    host: '/match',
  },
  {
    name: '내 소환사 목록',
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

  const curHeader = navigation.find(({ host, name }) => host === pathname);

  return (
    <>
      <Disclosure as="nav" className="bg-personal-1">
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
      { curHeader && (
      <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              { curHeader.name }
            </h1>
          </div>
      </header>
      )}
      <div className={`${curHeader ? 'main-container' : 'main-container-none-header'} max-w-7xl mx-auto p-1 md:p-5`}>
        { children }
      </div>
      <footer>
        footer
      </footer>
    </>
  )
}

export default connect(authMapStateToProps,authMapDispatchToProps)(LoginLayout);