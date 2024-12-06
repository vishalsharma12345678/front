import * as React from "react";

import "./app.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff, faBell } from "@fortawesome/free-solid-svg-icons";
import { Locations } from "./Route";
export default function App() {
  const [user, setuser] = useState();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };
  function data() {
    const us = localStorage.getItem("user");
    const g = JSON.parse(us);
    console.log(g);
    setuser(g);
  }
  function handleLogout() {
    const us = localStorage.removeItem("user");
    window.location.href = "/login";
  }
  useEffect(() => {
    data();
  }, []);

  return (
    // <Sidebark/>
    <>
      <header
        className={`${user == null ? "r" : ""}`}
        style={{
          height: "60px",
          backgroundColor: "#76b11d",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          zIndex: "1000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 30px",
          gap: "10px",
          border: "2px solid black",
        }}
      >
        <h1
          style={{
            alignSelf: "left",
            fontFamily: "Dancing Script, cursive",
            fontSize: "2.5rem",
          }}
        >
          OFF DAY INN
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <FontAwesomeIcon icon={faBell} style={{ color: "#ffffff" }} />
          <div className="dropdown">
            <button style={{ borderRadius: "10px" }} onClick={handleOpen}>
              <FontAwesomeIcon icon={faPowerOff} style={{ color: "#ffffff" }} />
            </button>
            {open ? (
              <ul className="menu1">
                <li className="menu1-item">
                  <button>{user.name}</button>
                </li>
                <li className="menu1-item">
                  <button>Change Password</button>
                </li>
                <li className="menu1-item">
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </header>
      <div
        style={
          localStorage.getItem("user") != null
            ? { position: "relative", top: "60px" }
            : {}
        }
      >
        <Locations user={user} />
      </div>
    </>
  );
}
