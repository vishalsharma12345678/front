import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import "./login.css";
import axios from "axios";
export function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  async function handleLogin(e) {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };
    // "http://localhost:4000/api/login/getlogin",
    try {
      await axios
        .post("http://localhost:4000/api/login/getlogin/", user)
        .then(async (response) => {
          console.log(await response.data.message);
          localStorage.setItem("user", JSON.stringify(await response.data));
          window.location.href = "/";
        });
    } catch (error) {
      // window.location.href = "/login";
      alert(error.response.data);
    }
  }
  return (
    <div className="main">
      <div className="frame">
        <div>
          <img src="Image20231227194057.png" alt="" />
        </div>
        <div>
          <h1 style={{ fontSize: "2rem" }}>Sign In</h1>
          <form onSubmit={handleLogin}>
            <p>
              <label for="">Username</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </p>
            <p>
              <label for="">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            <p>
              <button type="submit">Login</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
