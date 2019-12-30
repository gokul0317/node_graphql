import React, { Component } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

class AuthPage extends Component {
  state = {
    isLogin: true
  };
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  static contextType = AuthContext;

  switchMode = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = e => {
    e.preventDefault();
    let email = this.emailEl.current.value;
    let password = this.passwordEl.current.value;
    if (!email.trim().length || !password.trim().length) {
      return;
    }

    let requesBody = {
      query: `query{
            login(email: "${email}", password: "${password}"){
                userId
                token
                tokenExpiration
            }
        } `
    };

    if (!this.state.isLogin) {
      requesBody = {
        query: `
                      mutation{
                      createUser(userInput: {email: "${email}", password:"${password}" }){
                          _id
                          email
                      }
                      }
                  `
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requesBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201)
          throw new Error("Request Failed");
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
            this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration)
        }
      })
      .catch(err => console.log(err));
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" ref={this.emailEl} />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={this.switchMode}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
          <button type="submit">submit</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
