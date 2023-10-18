import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Login from "./Login";
import Home from "./Home";
import AuthProvider from "./AuthProvider";
import Profile from "./profile";

let App = () => {


  return (
    <>
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/Login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route exact path="/profile"> 
          <Profile/>
          </Route>
        </Switch>
      </Router>
      </AuthProvider>
      </>
      
  );
}

export default App;