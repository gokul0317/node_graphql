import React from "react";
import "./App.css";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Bookings";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/NavBar/MainNavigation";
import AuthContext from "./context/auth-context";

class App extends React.Component {
  state = {
    token: null,
    userId: null
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId
    });
  };

  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
  };
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout
            }}
          >
            <MainNavigation></MainNavigation>
            <main className="main-content">
              <Switch>
                {this.state.token && (
                  <Redirect exact from="/" to="/events"></Redirect>
                )}

                {this.state.token && (
                  <Redirect exact from="/auth" to="/events"></Redirect>
                )}

                {!this.state.token && (
                  <Route path="/auth" component={AuthPage}></Route>
                )}
                {this.state.token && (
                  <Route path="/bookings" component={BookingsPage}></Route>
                )}
                <Route path="/events" component={EventsPage}></Route>
                {!this.state.token && <Redirect exact to="/auth"></Redirect>}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
