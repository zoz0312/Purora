import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound from "../components/NotFound";
import { authMapStateToProps, AuthStateType} from "@store/auth";
import {connect} from "react-redux";
import Home from '@pages/home';
import Login from '@pages/login';
import CreateAccount from "@pages/create-account";
import LoginLayout from "@components/layout/login-layout";

const logoutRouters = [
  { path: '/', component: Login },
  { path: '/create-account', component: CreateAccount },
];

const commonRoutes = [
  { path: '/', component: Home },
  // { path: '/edit-profile', component: EditProfile },
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
        <LoginLayout user={user} token={token}>
          { commonRoutes.map(route => (
            <Route exact path={route.path} key={route.path} component={route.component} />
          ))}
        </LoginLayout>
      </Switch>
    </Router>
  )
}

export default connect(authMapStateToProps)(Routers);