import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://localhost:3000/auth/login", values)
      .then(res => {
        if (res.data.Status === "Success") {
          localStorage.setItem('token', res.data.token); // Store the token
          navigate("/chatpage"); // Redirect to Chatpage
          console.log("Login Success @ login page");
        } else {
          alert("Register/Signup for the Chat Page or check your login credentials or network.");
          console.log("Login Failed @ login page: " + res.data.Error);
        }
      })
      .catch(err => {
        alert("Register/Signup for the Chat Page or check your login credentials or network.");
        console.log("Login Failed @ catch of login page: " + err);
      });
  };

  return (
    <div className="signup-up-form">
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "3px" }}>
          <label htmlFor="email">Email:
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              id="email"
              name="email"
              className="form-control"
            />
          </label>
        </div>
        <div style={{ marginBottom: "3px" }}>
          <label htmlFor="password">Password:
            <input
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setValues({ ...values, password: e.target.value })}
              id="password"
              name="password"
              className="form-control"
              autoComplete="off"
            />
          </label>
        </div>
        <button type="submit">Log In</button>
        <p>You agree to the terms & conditions of the use of this site</p>
      </form>
      <Link to="/signup">SignUp</Link>
    </div>
  );
};

export default Login;