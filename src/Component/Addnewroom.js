import { useEffect, useState } from "react";
import { Sidebark } from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addRoom.css";
export function NewRoom({ user1 }) {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  const [roomtype, setRoomtype] = useState([]);
  const g = JSON.parse(user);
  const [data, setData] = useState([]);
  async function handlerAdd(e) {
    e.preventDefault();
    console.log(data);
    setData({
      ...data,
      ["userid"]: g._id,
    });
    console.log(data);
    const result = await axios.post(
      "http://localhost:4000/api/room/addroom",
      data
    );
    console.log(result);
    navigate("/RoomInventory");
  }
  const updateData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  async function roomtypes() {
    const roomtype = await axios.get("http://localhost:4000/api/Roomtype");
    setRoomtype(roomtype.data);
  }
  useEffect(() => {
    roomtypes();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebark user={user1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          left: "20%",
          width: "80%",
        }}
      >
        <div className="rooms" style={{ position: "relative", width: "100%" }}>
          <h1>Add New Room</h1>
          <form onSubmit={handlerAdd}>
            <p>
              <label for="">Rooms No</label>
              <br />
              <input type="text" name="roomNo" onChange={updateData} />
            </p>
            <p>
              <label>Room Type</label>
              <br />
              <select name="roomType" onChange={updateData}>
                <option value="" selected disabled>
                  choose....
                </option>
                {Array.from(roomtype).map((room) => {
                  return <option value={room.name}>{room.name}</option>;
                })}
              </select>
            </p>
            <p>
              <label>Room Amneities</label>
              <input type="text" name="Room_amneities" onChange={updateData} />
            </p>
            <p>
              <label>Room Status</label>
              <select name="Room_Status" onChange={updateData}>
                <option value="" disabled selected>
                  choose...
                </option>
                <option value="Available">Available</option>
                <option value="Locked">Locked</option>
              </select>
            </p>
            <p>
              <label>Rooms Type Name</label>
              <input
                type="text"
                name="room_type_name"
                placeholder="standard,city view, view room etc"
                onChange={updateData}
              />
            </p>
            <p>
              <label>Rate Type Name</label>
              <input
                type="text"
                name="rate_type_name"
                placeholder="Base Rate💲"
                onChange={updateData}
              />
            </p>
            <p>
              <label>Currency</label>
              <select name="currency" onChange={updateData}>
                <option value="USD">USD</option>
              </select>
            </p>
            <table
              style={{ width: "100%", borderCollapse: "collapse" }}
              border={"1px solid black"}
            >
              <tr>
                <th>Bed & Breakfast</th>
                <th>HalfBoard</th>
                <th>Full board</th>
                <th>Adult Charge</th>
              </tr>
              <tr>
                <td>
                  <input
                    type="number"
                    name="Bedbreakfast"
                    placeholder="bed & BReakfast"
                    onChange={updateData}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="halfboard"
                    placeholder="Half Board"
                    onChange={updateData}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    name="full_board"
                    placeholder="Full board"
                    onChange={updateData}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="adult_charge"
                    placeholder="Adult Charge"
                    onChange={updateData}
                  />
                </td>
              </tr>
            </table>

            <div>
              <button>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
