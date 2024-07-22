/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet, Link } from "react-router-dom";

import routes from "../app-routes.json";

export const Layout = () => {
  return (
    <>
      {Object.keys(routes).map((routeName) => (
        <div key={routeName}>
          <nav>
            <Link to={routes[routeName]}>{routeName}</Link>
          </nav>
        </div>
      ))}
      <Outlet />
    </>
  );
};
