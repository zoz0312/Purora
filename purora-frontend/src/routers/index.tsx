import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {AuthDispatchType, AuthStateType} from "@store/auth";

const commonRoutes = [
  { path: '/confirm', /* component: ConfirmEmail */ },
  // { path: '/edit-profile', component: EditProfile },
];

interface RoutersProps {
  user: object,
  token: string,
};

const Routers: React.FC<RoutersProps> = ({
  user,
  token,
}): JSX.Element => {
  return (
    <Router>
      <Switch>
        { commonRoutes.map(route => (
          <Route exact path={route.path} key={route.path} /*component={route.component}*/ />
        ))}
      </Switch>
    </Router>
  )
}

export default Routers;