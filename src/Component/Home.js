import { useEffect, useState } from "react";
import { Sidebark } from "./Sidebar";
import axios from "axios";
import "./some.css";
import React, { Component } from "react";
// import CanvasJSReact from "@canvasjs/react-charts";
import { Input } from "antd";
const { TextArea } = Input;

export function Home({ user }) {
  // var CanvasJS = CanvasJSReact.CanvasJS;
  // var CanvasJSChart = CanvasJSReact.CanvasJSChart;
  const [alldata, setAlldata] = useState({});
  const [details, setdetails] = useState({});
  async function fetchdata() {
    console.log("first");
    let taxdata = await axios.get(
      `http://localhost:4000/api/Company/details/find`
    );

    let data = await axios.get(`http://localhost:4000/api/room/roomsDetails`);
    // console.log(taxdata);
    setdetails(taxdata.data);
    let newdata = {
      emptyData: data.data.EmptyRooms,
      OccupiedRoom: data.data.OccupiedRoom,
      Upcomingbooking: data.data.Upcomingbooking,
      Lastbooking: data.data.Lastbooking,
    };
    console.log(newdata);
    setAlldata(newdata);
  }

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebark user={user} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          left: "20%",
          width: "80%",
        }}
      >
        <div className="d-flex" style={{ padding: "2rem", width: "100%" }}>
          <Block>
            <h1>{alldata.emptyData}</h1>
            <p>Empty Rooms</p>
          </Block>
          <Block>
            <h1>{alldata.OccupiedRoom}</h1>
            <p>Occupied Rooms</p>
          </Block>
          <Block>
            <h1>{alldata.Upcomingbooking}</h1>
            <p>Upcoming Booking</p>
          </Block>
          <Block>
            <h1>{alldata.Lastbooking}</h1>
            <p>Completed Booking</p>
          </Block>
          <Block>
            <h1>0</h1>
            <p>Total Bussiness</p>
          </Block>
        </div>
        <div></div>
        <div>
          {details[0] ? (
            <Tax Tgst={details[0]["Tgst_Tax"]} Tax={details[0]["Tax"]} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
function Block({ children }) {
  return (
    <div className="block" style={{ display: "flex" }}>
      {children}
    </div>
  );
}

export function Tax({ Tgst, Tax }) {
  const [tgst, setTgst] = useState(Tgst);
  const [tax, setTax] = useState(Tax);
  function handleClick() {
    const last = axios.post("http://localhost:4000/api/Company/details/find", {
      Tgst_Tax: tgst,
      Tax: tax,
    });
  }
  return (
    <>
      <h1>UPDATE TAX DETAILS</h1>
      <div style={{ display: "flex", gap: "10px", marginTop: "40px" }}>
        <TextArea
          placeholder="TGST"
          value={tgst}
          onChange={(e) => setTgst(+e.target.value)}
          autoSize
        />
        <TextArea
          placeholder="Green Tax"
          onChange={(e) => setTax(+e.target.value)}
          value={tax}
          autoSize
        />
        <button onClick={handleClick}>Update</button>
      </div>
    </>
  );
}
