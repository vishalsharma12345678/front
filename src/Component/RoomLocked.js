import { Sidebark } from "./Sidebar";
import "./RoomInvertroy.css";
import axios from "axios";
import { useEffect, useState } from "react";
export function RoomLocked({ user }) {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setFetching] = useState(false);
  async function lockroom(id) {
    console.log(id);
    // setFetching(true);
    let roomsdata = await axios.get(
      `http://localhost:4000/api/room/unlockRoom/${id}`
    );
    fetchData();
    // setFetching(false);
  }
  async function fetchData() {
    setFetching(true);
    let roomsdata = await fetch("http://localhost:4000/api/room/lockRoom");
    let data = await roomsdata.json();
    setRooms((s) => data);
    setFetching(false);
  }
  useEffect(() => {
    fetchData();
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
        <div
          className="rooms inv"
          style={{ position: "relative", width: "100%" }}
        >
          <h1>Rooms Locked</h1>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Rooms</th>
                <th>Rooms_type</th>
                <th>Rooms_Ameneties</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? null : rooms.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No Rooms are Locked.
                  </td>
                </tr>
              ) : (
                Array.from(rooms).map((room, index) => {
                  return (
                    <tr key={room._id}>
                      <td>{index + 1}</td>
                      <td>{room.roomNo}</td>
                      <td>{room.roomType}</td>
                      <td>{room.Room_amneities}</td>
                      <td>
                        {room.Room_Status === "Locked" ? (
                          <button onClick={() => lockroom(room._id)}>
                            Unlock
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
