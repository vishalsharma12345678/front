import { useState, useEffect } from "react";
import { Sidebark } from "./Sidebar";
import axios from "axios";
import "./upcoming.css";
export function RoomType({ user }) {
  const [RoomType, setRoomType] = useState([]);
  const [open, setopen] = useState(false);
  async function fetch1() {
    const res = await axios.get("http://localhost:4000/api/Roomtype");
    setRoomType(res.data);
  }
  async function Delete(id) {
    console.log(id);
    await axios.get(`http://localhost:4000/api/deleteRoomtype/${id}`);
    fetch1();
  }
  useEffect(() => {
    fetch1();
  }, []);

  return (
    <>
      {open && <RoomTypeg open={setopen} fetch1={fetch1} />}
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
            className="rooms book"
            style={{ position: "relative", width: "100%" }}
          >
            <h1>Room Types</h1>
            <button style={{ textAlign: "end" }} onClick={(e) => setopen(true)}>
              Add Room Type
            </button>
            <table width={"100%"}>
              <thead>
                <tr>
                  <th>SNo..</th>
                  <th>Room Type.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(RoomType).map((i, index) => {
                  return (
                    <tr>
                      <td style={{ fontSize: "15px" }}>{index + 1}</td>
                      <td style={{ fontSize: "15px" }}>{i.name}</td>
                      <td>
                        <div
                          onClick={(e) => {
                            Delete(i._id);
                          }}
                        >
                          <i
                            class="fa-solid fa-trash-can fa-flip-horizontal"
                            style={{
                              color: "black",
                              fontSize: "15px",
                              cursor: "pointer",
                            }}
                          ></i>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export function RoomTypeg({ open, fetch1 }) {
  let style = {
    border: "2px solid white",
    borderRadius: "5px",
    height: "35px",
    margin: "5px",
  };
  const [data, setuser] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();

    await axios
      .post("http://localhost:4000/api/addRoomtype", {
        data: data,
      })
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
          Room Type
        </label>
        <input
          type="text"
          value={data}
          style={style}
          onChange={(e) => setuser(e.target.value)}
        />
        <button>Save</button>
      </form>
    </div>
  );
}
