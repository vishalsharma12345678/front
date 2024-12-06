import { useEffect } from "react";
import { Sidebark } from "./Sidebar";
import axios from "axios";
import { useState } from "react";

export function User({ user }) {
  const [Users, setUsers] = useState([]);
  const [User, setUser] = useState();

  const [open, setopen] = useState(false);
  const [open1, setopen1] = useState(false);

  async function update(e, id) {
    let ids = {
      id: id,
      value: e.target.value,
    };
    await axios.post("http://localhost:4000/api/user/update", ids);
    console.log(ids);
  }
  async function fetch1() {
    let data = await axios.get("http://localhost:4000/api/user/");
    setUsers(data.data);
  }
  async function Delete(id) {
    await axios.get(`http://localhost:4000/api/user/deleteUser/${id}`);
    fetch1();
  }
  async function updateUser() {
    let data = await axios.post("http://localhost:4000/api/updatedetails");
    setUsers(data.data);
  }
  useEffect(() => {
    fetch1();
  }, []);

  return (
    <>
      {open ? <AddUser fetch1={fetch1} open={setopen} /> : null}
      {open1 ? (
        <UpdateUser fetch1={fetch1} open={setopen1} user={User} />
      ) : null}

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
            <button style={{ textAlign: "end" }} onClick={() => setopen(!open)}>
              Add User
            </button>
            <table width="100%">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Username</th>
                <th>mobileNumber</th>
                <th>address</th>
                <td>Admin</td>
                <th>Action</th>
              </tr>
              {Users.map((user, i) => {
                return (
                  <tr>
                    <td>{i}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.address}</td>
                    <td>
                      <select
                        name="isAdmin"
                        id=""
                        onChange={(e) => update(e, user._id)}
                      >
                        <option
                          selected={user.isAdmin === "Admin"}
                          value={"Admin"}
                        >
                          Admin
                        </option>
                        <option
                          selected={user.isAdmin === "Maneger"}
                          value={"Maneger"}
                        >
                          Maneger
                        </option>
                        <option
                          selected={user.isAdmin === "Reception"}
                          value={"Reception"}
                        >
                          Reception
                        </option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => (setUser(user), setopen1(true))}>
                        Edit
                      </button>
                      <button onClick={() => Delete(user._id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export function AddUser({ fetch1, open }) {
  let style = {
    border: "2px solid white",
    borderRadius: "5px",
    height: "35px",
    margin: "5px",
  };
  const [Name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setaddress] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [booking, setbooking] = useState(false);
  const [addRoom, setaddRooms] = useState(false);
  const [lockedRoom, setlockedRoom] = useState(false);
  const [Roomtype, setRoomtype] = useState(false);
  const [Users, setUser] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    let data = {
      name: Name,
      username: username,
      password: password,
      mobileNumber: mobileNumber,
      address: address,
      isAdmin: isAdmin,
      booking: booking,
      addRoom: addRoom,
      lockedRoom: lockedRoom,
      Roomtype: Roomtype,
      Users: Users,
    };
    await axios
      .post("http://localhost:4000/api/user/createUser", data)
      .then((result) => {
        open(false);
        fetch1();
      });
  }
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "10000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(255,255,255,0.7)",
      }}
    >
      <form
        action=""
        style={{
          width: "30%",
          padding: "2rem",
          backgroundColor: "black",
          borderRadius: "10px",
          opacity: "1",
        }}
        onSubmit={(e) => handleSubmit(e)}
      >
        <p
          onClick={() => {
            open(false);
          }}
          style={{
            color: "white",
            width: "100%",
            textAlign: "end",
            cursor: "pointer",
          }}
        >
          X
        </p>
        <label style={{ color: "white" }} htmlFor="">
          Name
        </label>
        <input
          name="name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          style={style}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Username
        </label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={style}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Password
        </label>
        <input
          name="password"
          style={style}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Mobile Number
        </label>
        <input
          name="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          style={style}
          type="number"
        />
        <label style={{ color: "white" }} htmlFor="">
          Address
        </label>
        <input
          name="address"
          style={style}
          type="text"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
        <label style={{ color: "white" }} htmlFor="">
          Role
        </label>
        <br />
        <select
          style={style}
          name="isAdmin"
          onChange={(e) => setIsAdmin(e.target.value)}
        >
          <option value={"Admin"}>Admin</option>
          <option selected value={"Maneger"}>
            Maneger
          </option>
          <option value={"Reception"}>Reception</option>
        </select>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Create Booking
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="booking"
            id=""
            checked={booking}
            onChange={(e) => setbooking(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Add Rooms
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="Add_rooms"
            id=""
            checked={addRoom}
            onChange={(e) => setaddRooms(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Locked Rooms
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={lockedRoom}
            onChange={(e) => setlockedRoom(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Rooms type
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={Roomtype}
            onChange={(e) => setRoomtype(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            User Sections
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={Users}
            onChange={(e) => setUser(e.target.checked)}
          />
        </div>
        <br />
        <button>Save</button>
      </form>
    </div>
  );
}

export function UpdateUser({ fetch1, open, user }) {
  let style = {
    border: "2px solid white",
    borderRadius: "5px",
    height: "35px",
    margin: "5px",
  };
  const [Name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState(user.password);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [address, setaddress] = useState(user.address);
  const [isAdmin, setIsAdmin] = useState(user.isAdmin);
  const [booking, setbooking] = useState(user.booking);
  const [addRoom, setaddRooms] = useState(user.addRoom);
  const [lockedRoom, setlockedRoom] = useState(user.lockedRoom);
  const [Roomtype, setRoomtype] = useState(user.Roomtype);
  const [Users, setUser] = useState(user.Users);
  async function handleSubmit(e) {
    e.preventDefault();

    let data = {
      id: user._id,
      name: Name,
      username: username,
      password: password,
      mobileNumber: mobileNumber,
      address: address,
      isAdmin: isAdmin,
      booking: booking,
      addRoom: addRoom,
      lockedRoom: lockedRoom,
      Roomtype: Roomtype,
      Users: Users,
    };
    await axios
      .post("http://localhost:4000/api/user/updatedetails", data)
      .then((result) => {
        open(false);
        fetch1();
      });
  }
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "10000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(255,255,255,0.7)",
      }}
    >
      <form
        action=""
        style={{
          width: "30%",
          padding: "2rem",
          backgroundColor: "black",
          borderRadius: "10px",
          opacity: "1",
        }}
        onSubmit={(e) => handleSubmit(e)}
      >
        <p
          onClick={() => {
            open(false);
          }}
          style={{
            color: "white",
            width: "100%",
            textAlign: "end",
            cursor: "pointer",
          }}
        >
          X
        </p>
        <label style={{ color: "white" }} htmlFor="">
          Name
        </label>
        <input
          name="name"
          value={Name}
          onChange={(e) => setName(e.target.value)}
          style={style}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Username
        </label>
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={style}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Password
        </label>
        <input
          name="password"
          style={style}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
        />
        <label style={{ color: "white" }} htmlFor="">
          Mobile Number
        </label>
        <input
          name="mobileNumber"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          style={style}
          type="number"
        />
        <label style={{ color: "white" }} htmlFor="">
          Address
        </label>
        <input
          name="address"
          style={style}
          type="text"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
        <label style={{ color: "white" }} htmlFor="">
          Role
        </label>
        <br />
        <select
          style={style}
          name="isAdmin"
          onChange={(e) => setIsAdmin(e.target.value)}
        >
          <option selected={user.isAdmin === "Admin"} value={"Admin"}>
            Admin
          </option>
          <option selected={user.isAdmin === "Maneger"} value={"Maneger"}>
            Maneger
          </option>
          <option selected={user.isAdmin === "Reception"} value={"Reception"}>
            Reception
          </option>
        </select>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Create Booking
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="booking"
            id=""
            checked={booking}
            onChange={(e) => setbooking(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Add Rooms
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="Add_rooms"
            id=""
            checked={addRoom}
            onChange={(e) => setaddRooms(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Locked Rooms
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={lockedRoom}
            onChange={(e) => setlockedRoom(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            Rooms type
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={Roomtype}
            onChange={(e) => setRoomtype(e.target.checked)}
          />
        </div>
        <br />
        <div style={{ display: "flex" }}>
          <label style={{ color: "white" }} htmlFor="">
            User Sections
          </label>
          <input
            style={{ width: "20px" }}
            type="checkbox"
            name="LockedRooms"
            id=""
            checked={Users}
            onChange={(e) => setUser(e.target.checked)}
          />
        </div>
        <br />
        <button>Save</button>
      </form>
    </div>
  );
}
