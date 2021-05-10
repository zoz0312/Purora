import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect, useHistory, useLocation} from 'react-router-dom';
import NotFound from "../components/NotFound";
import { authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";
import Home from '@pages/home';
import Login from '@pages/login';
import CreateAccount from "@pages/create/create-account";
import MySummoner from "@pages/my/my-summoner";
import MyProfile from "@pages/my/my-profile";
import MatchPage from "@pages/match";
import MyMatchPage from "@pages/my/my-match";
import CreateSummonerPage from "@pages/create/create-summoner";
import ModifySummonerPage from "@pages/modify/modify-summoner";

const logoutRouters = [
  { path: '/', component: Login },
  { path: '/create/account', component: CreateAccount },
];

const commonRoutes = [
  { path: '/', component: Home },
  { path: '/match', component: MatchPage },
  { path: '/my/match', component: MyMatchPage },
  { path: '/my/summoner', component: MySummoner },
  { path: '/my/profile', component: MyProfile },
  { path: '/create/summoner', component: CreateSummonerPage },
  { path: '/modify/summoner/:summonerId', component: ModifySummonerPage },
];

interface RoutersProps extends AuthStateType {};

const Routers: React.FC<RoutersProps> = (
  {
    user,
    token,
  }
): JSX.Element => {
  // LogOut
  if (!user || !token) {
    return (
      <Router>
        <Switch>
          { logoutRouters.map(route => (
            <Route exact path={route.path} key={route.path} component={route.component} />
          ))}
          <Route component={NotFound}/>
        </Switch>
      </Router>
    )
  }

  // LogIn
  return (
    <Router>
      <Switch>
        { commonRoutes.map(route => (
          <Route exact path={route.path} key={route.path} component={route.component} />
        ))}
        <Route component={NotFound}/>
      </Switch>
    </Router>
  )
}

export default connect(authMapStateToProps)(Routers);