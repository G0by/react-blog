import React from 'react';

import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const RedirectIfAuth = ({
  path, props, component: Component, isNotAuthenticated,
}) => ((
  <Route
    path={path}
    render={
      (routerProps) => {
        if (isNotAuthenticated) {
          return <Component {...props} {...routerProps} />;
        }

        return <Redirect to="/" />;
      }
    }
  />

));

RedirectIfAuth.propTypes = {
  isNotAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  props: PropTypes.objectOf(PropTypes.any),
};

RedirectIfAuth.defaultProps = {
  props: {},
};

export default RedirectIfAuth;
