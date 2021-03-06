import React from 'react';
import {useHistory, useLocation} from "react-router-dom";
import { Disclosure } from '@headlessui/react'
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
  logout: () => void;
  user: any;
}

const navigation: NavigationMenu[] = [
  {
    name: '전체 소환사',
    host: '/',
  },
  {
    name: '전체 전적조회',
    host: '/match',
  },
  {
    name: '내 전적조회',
    host: '/my/match',
  },
  {
    name: '내 소환사 목록',
    host: '/my/summoner',
  },
];

const profile: NavigationMenu[] = [
  // {
  //   name: '내 정보',
  //   host: '/my/profile',
  // },
];

interface LoginLayoutProps extends AuthStateType, AuthDispatchType {};

const LoginLayout: React.FC<LoginLayoutProps> = (
  {
    children,
    user,
    token,
    setLogout,
  }
) => {
  let { pathname } = useLocation();
  const history = useHistory();

  const curHeader = navigation.find(({ host, name }) => host === pathname);

  const logout = () => {
    setLogout();
    history.push('/');
  }

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
              logout={logout}
              user={user}
            />
            <NavigationMobile
              navigation={navigation}
              profile={profile}
              pathname={pathname}
              open={open}
              logout={logout}
              user={user}
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
        Author: zoz0312 (AJu) [GitHub | Naver Blog]
      </footer>
    </>
  )
}

export default connect(authMapStateToProps,authMapDispatchToProps)(LoginLayout);