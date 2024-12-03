import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Signup = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("user values", values)
      const res = await axios.post("http://localhost:3000/api/auth/register", values, { withCredentials: true });
      console.log(res.data);
      if (res.status === 201) {
        //alert("Signup Success @ signup page");
        navigate(`${res.data.redirectTo}`);
      } else {
        alert("Error: " + res.data.Error + " - " + "Signup Failed @ alert signup page");
      }
    } catch (err) {
      console.log(err + " - " + "Signup Failed @ catch of signup page");
      alert("Signup failed, please check your network and try again.");
    }
  };

  return (
    <div className="signup-up-form">
      <h2>Sign Up Page</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "3px" }}>
          <label htmlFor="username"><strong>Username:</strong>
            <input
              type="text"
              placeholder="Enter Username"
              name="username"
              onChange={e => setValues({ ...values, username: e.target.value })}
              className="form-control"
            />
          </label>
        </div>
        <div style={{ marginBottom: "3px" }}>
          <label htmlFor="email"><strong>Email:</strong>
            <input
              type="email"
              autoComplete="off"
              placeholder="Enter Email"
              name="email"
              onChange={e => setValues({ ...values, email: e.target.value })}
              className="form-control"
            />
          </label>
        </div>
        <div style={{ marginBottom: "3px" }}>
          <label htmlFor="password"><strong>Password:</strong>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={e => setValues({ ...values, password: e.target.value })}
              className="form-control"
              autoComplete="off"
            />
          </label>
        </div>
        <button type="submit">Sign Up</button>
        <p>Next is to fill a simple ID form</p>
      </form>
      <Link to="/" type="submit"><strong>opt-out</strong></Link>
    </div>
  );
};

export default Signup;