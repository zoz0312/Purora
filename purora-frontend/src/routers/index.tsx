import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from "@pages/Home";
import Login from "@pages/Login";

const logoutRouters = [
  { path: '/', component: Login },
];

const commonRoutes = [
  { path: '/', component: Home },
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
  console.log('user', user)
  console.log('token', token)

  // LogOut
  if (!user || !token) {
    return (
      <Router>
        <Switch>
          { logoutRouters.map(route => (
            <Route exact path={route.path} key={route.path} component={route.component} />
          ))}
          {/*<Route component={NotFound}/>*/}
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
      </Switch>
    </Router>
  )
}

export default Routers;