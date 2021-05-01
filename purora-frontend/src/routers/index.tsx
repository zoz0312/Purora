import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const commonRoutes = [
  { path: '/confirm', /* component: ConfirmEmail */ },
  // { path: '/edit-profile', component: EditProfile },
];

const Routers: React.FC = (

): JSX.Element => {
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