import { Sidebark } from "./Sidebar";
import "./bookingRoom.css";
import { updateBooking } from "./updatebooking";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
export function Booking({ user }) {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setFetching] = useState(false);
  async function handleEdit(e, id, currentbookingid) {
    // setFetching(true);
    const ids = {
      bookingid: id,
      roomsid: currentbookingid,
    };
    // console.log(ids)
    let roomsdata = await axios.post(
      `http://localhost:4000/api/book/updateBooking`,
      ids
    );
    fetchData();

    // setFetching(false);
  }
  async function handleEdit1(e, id) {
    // setFetching(true);
    const ids = {
      bookingid: id,
      value: e.target.value,
    };
    // console.log(ids)
    let roomsdata = await axios.post(
      `http://localhost:4000/api/book/updateBookingEntry`,
      ids
    );
    fetchData();

    // setFetching(false);
  }
  async function DeleteRoom(id) {
    // setFetching(true);
    await axios.get(`http://localhost:4000/api/book/deletebooking/${id}`);
    fetchData();
    // setFetching(false);
  }
  async function fetchData() {
    setFetching(true);
    let roomsdata = await fetch("http://localhost:4000/api/book/allBookings");
    let data = await roomsdata.json();
    console.log(data);
    setRooms((s) => data);
    setFetching(false);
  }
  useEffect(() => {
    fetchData();
  }, []);
  // console.log(user)
  return (
    <div style={{ display: "flex" }}>
      <Sidebark />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          left: "20%",
          width: "80%",
        }}
      >
        <div className="rooms book" style={{ position: "relative" }}>
          <h1>Room Booking</h1>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Rooms No</th>
                <th>Guest Name</th>
                <th>Reg No.</th>
                <th>Checked In</th>
                <th>Expected CheckOut</th>
                <th>Verfied By</th>
                <th>Remark</th>
                <th>Entry Status</th>
                <th>Booking Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? null : rooms.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
                    No Booking Found in logs
                    <Link to="/newbooking">
                      <button>Add Booking</button>
                    </Link>
                  </td>
                </tr>
              ) : (
                Array.from(rooms).map((room, index) => {
                  return (
                    <tr key={room._id}>
                      <td>{index + 1}</td>
                      <td>{room.room_number.roomNo}</td>
                      <td>{room.full_name}</td>
                      <td>{room.registrationNo}</td>
                      <td>{room.check_in}</td>
                      <td>{room.check_out}</td>
                      <td>{room.verifiedby}</td>

                      <td>{room.remark}</td>
                      <td>
                        <select
                          name="status"
                          disabled={
                            room.check_in_check_out === "Checkedout" ||
                            room.status !== "booked"
                              ? true
                              : false
                          }
                          onChange={(e) => handleEdit1(e, room._id)}
                        >
                          <option
                            value="Checkedin"
                            selected={room.check_in_check_out === "Checkedin"}
                          >
                            CheckedIn
                          </option>
                          <option
                            value="Checkedout"
                            selected={room.check_in_check_out === "Checkedout"}
                          >
                            CheckedOut
                          </option>
                          <option
                            value="waiting to checkin"
                            disabled
                            selected={
                              room.check_in_check_out === "waiting to checkin"
                            }
                          >
                            Waiting to checkIn
                          </option>
                        </select>
                      </td>
                      <td>
                        <select
                          name="status"
                          disabled={
                            room.status !== "booked" ||
                            room.check_in_check_out === "Checkedin" ||
                            room.check_in_check_out === "Checkedout"
                              ? true
                              : false
                          }
                          onChange={(e) =>
                            handleEdit(e, room._id, room.currentbooking)
                          }
                        >
                          <option value="" selected={room.status === "booked"}>
                            Booked
                          </option>
                          <option value="" selected={room.status !== "booked"}>
                            Canceled
                          </option>
                        </select>
                      </td>
                      <td>{room.createdAt}</td>
                      <td>
                        <NavLink to={`/EditRoom/${room._id}`}>
                          <button
                            disabled={
                              room.check_in_check_out === "Checkedout" ||
                              room.status !== "booked"
                                ? true
                                : false
                            }
                            style={{
                              cursor: `${
                                room.status !== "booked" ||
                                room.check_in_check_out === "Checkedout"
                                  ? "not-allowed"
                                  : ""
                              }`,
                            }}
                          >
                            Edit
                          </button>
                        </NavLink>
                        {user.isAdmin === "Admin" ? (
                          <button onClick={() => DeleteRoom(room._id)}>
                            Delete
                          </button>
                        ) : (
                          ""
                        )}
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
