import { useEffect, useState } from "react";
import { Sidebark } from "./Sidebar";
import { Opions } from "./options";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import "./newboing.css";
import axios from "axios";

export function NewBooking({ user1 }) {
  const user = localStorage.getItem("user");
  const g = JSON.parse(user);
  const [disabled, setDisabled] = useState(true);
  const [wpps, setWpps] = useState(false);
  const [check_in, setCheck_in] = useState();
  const [check_out, setcheck_out] = useState();
  const [rooms, setRooms] = useState([]);
  const [data, setData] = useState({});
  const [phone, setPhone] = useState(0);
  const [reg, setreg] = useState(0);
  const [roomtype, setRoomtype] = useState([]);

  const [guests, setGuests] = useState([]);
  function handlerCheckIn(e) {
    setCheck_in((a) => e.target.value);
  }
  async function handlerCheckOut(e, value1) {
    // console.log(value);
    let rooms = await axios.post(
      "http://localhost:4000/api/room/getallroomsAvalible",
      { value: value1 }
    );
    // console.log(rooms);
    let data = await rooms.data;
    // console.log(check_in + " " + check_out);
    let g = [];
    Array.from(data).forEach((item) => {
      let availability;
      for (var booking of item.currentbookings) {
        availability = true;
        if (item.currentbookings.length) {
          const date = new Date(check_in);
          const date1 = new Date(check_out);

          const start = new Date(booking.formdate);
          const end = new Date(booking.todate);
          if (
            (date >= start && date <= end) ||
            (date1 >= start && date1 <= end)
          ) {
            availability = false;
          }
          if (
            (start >= date && start <= date1) ||
            (end >= date && end <= date1)
          ) {
            availability = false;
          }
        }
        if (!availability) break;
      }
      //   console.log(availability);
      if (availability || item.currentbookings.length === 0) {
        g.push(item);
      }
    });
    setRooms(g);
  }
  function handleraddGuest(e) {
    e.preventDefault();
    setGuests((items) => [
      ...items,
      {
        name: "",
        dob: "",
        wp_pass: "",
        nationality: "",
      },
    ]);
  }
  const updateData = (e) => {
    if (e.target.name === "adultNo") {
      setData((s) => ({ ...s, [e.target.name]: e.target.value }));
      setData((s) => ({
        ...s,
        ["room_number"]: rooms.slice(0, Math.ceil(e.target.value / 4)),
      }));
      return;
    }
    setData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };
  function deleteguest(e, i) {
    e.preventDefault();
    console.log(guests);
    let f = guests;

    const filtredguest = f.filter((guest, j) => {
      return j !== i;
    });
    setGuests(filtredguest);
  }
  const updateGuest = (e, i) => {
    const newguests = [...guests];
    newguests[i][e.target.name] = e.target.value;
    setGuests(newguests);
  };
  async function handlerChange(value) {
    setData((s) => ({
      ...s,
      ["verifiedby"]: g.username,
    }));
    setData((s) => ({ ...s, ["userid"]: g._id }));
    const i = rooms.filter((roomg) => {
      if (roomg._id === value) {
        return roomg;
      }
    });
    setData((s) => ({ ...s, ["price"]: Number(i[0].rate_type_name) }));
  }
  async function handlerSubmit(e) {
    e.preventDefault();
    const fullData = { ...data, guest: guests };
    const curUser = await axios.post(
      "http://localhost:4000/api/book/addbooking",
      fullData
    );
    window.location.href = "/";
  }

  async function roomtypes() {
    const roomtype = await axios.get("http://localhost:4000/api/Roomtype");
    const regno = await axios.get(
      "http://localhost:4000/api/book/allBookingslength"
    );

    setreg((s) => regno.data.booking);
    setRoomtype(roomtype.data);
    setData((s) => ({
      ...s,
      ["invoice_No"]: `CMIV-${new Date().getFullYear()}/`,
    }));
    setData((s) => ({ ...s, ["registrationNo"]: regno.data.booking }));
    setData((s) => ({ ...s, ["group"]: "no" }));
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
        <div className="d-flex" style={{ position: "relative", width: "100%" }}>
          <div>
            <form
              onSubmit={handlerSubmit}
              className="formreg"
              style={{
                display: "flex",
                flexWrap: "wrap",
                padding: "3rem",
                gap: "10px",
              }}
            >
              <h1 style={{ width: "100%" }}>NEW BOOKING</h1>

              <p>
                <label for="">Reg No</label>
                <br />
                <input
                  type="text"
                  required
                  value={data.registrationNo}
                  name="registrationNo"
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Invoice No.</label>
                <br />
                <input
                  type="text"
                  required
                  name="invoice_No"
                  value={data.invoice_No}
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Log No.</label>
                <br />
                <input
                  type="number"
                  // required
                  name="log_No"
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">check in</label>
                <br />
                <input
                  type="date"
                  name="check_in"
                  required
                  onChange={(e) => {
                    handlerCheckIn(e);
                    updateData(e);
                  }}
                />
              </p>
              <p>
                <label for="">Expected Check out</label>
                <br />
                <input
                  type="date"
                  name="check_out"
                  required
                  onChange={(e) => {
                    setcheck_out(e.target.value);
                    updateData(e);
                  }}
                />
              </p>
              <p>
                <label for="">Room Type</label>
                <br />
                <select
                  name="room_type"
                  required
                  onChange={(e) => {
                    handlerCheckOut(e, e.target.value);
                    updateData(e);
                  }}
                >
                  <option value="" selected disabled>
                    choose...
                  </option>
                  {Array.from(roomtype).map((room) => {
                    return <option value={room.name}>{room.name}</option>;
                  })}
                </select>
              </p>
              <p>
                <label for="">Room Number</label>
                <br />
                <select
                  name="room_number"
                  required
                  onChange={(e) => handlerChange(e.target.value)}
                >
                  <option selected disabled value="">
                    choose...
                  </option>
                  {rooms.map((room) => {
                    return <option value={room._id}>{room.roomNo}</option>;
                  })}
                </select>
              </p>
              <p>
                <label for="">No of Pax</label>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="number"
                    required
                    style={{ width: "45%" }}
                    name="adultNo"
                    value={data.adultNo}
                    onChange={(e) => (
                      updateData(e),
                      Math.ceil(e.target.value / 4) > rooms.length
                        ? alert(
                            `the Max Capicity of room is ${Math.ceil(
                              rooms.length * 4
                            )} Person`
                          )
                        : "",
                      Math.ceil(e.target.value / 4) > rooms.length
                        ? setData((s) => ({ ...s, [e.target.name]: "" }))
                        : ""
                    )}
                    placeholder="no of adult"
                  />
                  <input
                    type="number"
                    style={{ width: "45%" }}
                    name="children"
                    required
                    onChange={updateData}
                    placeholder="no of child"
                  />
                  {/* <input
                    type="checkbox"
                    name="adultCharges"
                    onChange={updateData}
                    id=""
                  /> */}
                </div>
              </p>

              <p>
                <label for="">Meal Plan</label>
                <br />
                <select
                  name="meal_plan"
                  required
                  onChange={(e) => {
                    updateData(e);
                  }}
                >
                  <option value="" disabled selected>
                    choose...
                  </option>
                  <option value="room_only">Room Only</option>
                  <option value="breakfast_price">Bed & BreakFast</option>
                  <option value="half_board">Half Board</option>
                  <option value="full_board">Full Board</option>
                </select>
              </p>
              <p>
                <label for="">Guest Basis</label>
                <br />
                <select required name="guest_basis" onChange={updateData}>
                  <option value="" disabled selected>
                    choose...
                  </option>
                  <option value="direct booking">Direct booking</option>
                  <option value="fit">FIT</option>
                  <option value="OTA">OTA</option>
                </select>
              </p>
              <p>
                <label for="">Guest Type</label>
                <br />
                <select
                  name="guest_type"
                  required
                  onChange={(e) => {
                    e.target.value === "tourist"
                      ? setWpps(true)
                      : setWpps(false);
                    updateData(e);
                  }}
                >
                  <option value="" disabled selected>
                    choose...
                  </option>
                  <option value="local">Local</option>
                  <option value="work_permit">Work Permit</option>
                  <option value="tourist">Tourist</option>
                </select>
              </p>
              <div style={{ width: "32.33%" }}>
                <p style={{ margin: 0 }}>
                  <label for="">bill to</label>
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                  }}
                >
                  <input
                    type="radio"
                    name="bill_to"
                    value="customer"
                    required
                    onChange={(e) => {
                      setDisabled(true);
                      updateData(e);
                    }}
                  />
                  <label for="customer">Customer</label>
                  <input
                    type="radio"
                    name="bill_to"
                    required
                    onChange={(e) => {
                      setDisabled(false);
                      updateData(e);
                    }}
                    value="company"
                  />
                  <label for="company">Company</label>
                </div>
              </div>
              <p>
                <label for="">Company Name</label>
                <input
                  type="text"
                  required
                  name="company_name"
                  disabled={disabled}
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Full Name</label>
                <input
                  type="text"
                  required
                  name="full_name"
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Email</label>
                <input
                  type="text"
                  required
                  name="email"
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Mobile number</label>
                <PhoneInput
                  country={"eg"}
                  enableSearch={true}
                  value={phone}
                  onChange={(phone1) => (
                    setPhone((s) => phone1),
                    setData((s) => ({ ...s, ["phone"]: phone1 }))
                  )}
                />
              </p>
              <p>
                <label for="">WP/ND</label>
                <input
                  type="text"
                  name="wp_nd"
                  disabled={wpps}
                  onChange={updateData}
                />
              </p>
              <p>
                <label for="">Passport</label>
                <input
                  type="text"
                  disabled={!wpps}
                  name="passport_number"
                  onChange={updateData}
                />
              </p>

              <p>
                <label for="">Natinality</label>
                <select name="nationality" required onChange={updateData}>
                  <Opions />
                </select>
              </p>
              <p>
                <label for="">Country of Residence</label>
                <select name="country_residence" required onChange={updateData}>
                  <Opions />
                </select>
              </p>
              <p>
                <label for="">D.O.B</label>
                <input type="date" name="dob" onChange={updateData} />
              </p>
              <p>
                <label for="">Profession</label>
                <input type="text" name="proffesion" onChange={updateData} />
              </p>

              <p>
                <label for="">Group</label>
                <div style={{ display: "flex", width: "100%" }}>
                  <select name="group" required onChange={updateData}>
                    <option value="no">no</option>
                    <option value="yes">yes</option>
                  </select>
                </div>
              </p>

              <p>
                <label for="">Upload Id</label>
                <input type="file" id="" name="" accept=".jpg,.pdf,.png" />
              </p>

              <p>
                <button onClick={(e) => handleraddGuest(e)}>
                  Add More Guest
                </button>
              </p>
              {guests.map((guest, i) => {
                return (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className="guest"
                  >
                    <p>
                      <label htmlFor="">Name</label>
                      <input
                        type="text"
                        placeholder="Name"
                        required
                        name="name"
                        value={guest.name}
                        onChange={(e) => updateGuest(e, i)}
                      />
                    </p>
                    <p>
                      <label htmlFor="">DOB</label>
                      <input
                        type="date"
                        name="dob"
                        value={guest.dob}
                        onChange={(e) => updateGuest(e, i)}
                      />
                    </p>
                    <p>
                      <label htmlFor="">WP/PP/NID IN</label>
                      <input
                        type="number"
                        name="wp_pass"
                        required
                        placeholder="WP/PP/NID IN"
                        value={guest.wp_pass}
                        onChange={(e) => updateGuest(e, i)}
                      />
                    </p>
                    <p>
                      <label htmlFor="">Nationality</label>
                      <select
                        name="nationality"
                        required
                        placeholder="nationality"
                        onChange={(e) => updateGuest(e, i)}
                      >
                        <Opions />
                      </select>
                    </p>
                    <p>
                      <label htmlFor="">Upload file</label>
                      <input type="file" />
                    </p>
                    <button
                      style={{ height: "45%", fontSize: "14px" }}
                      onClick={(e) => deleteguest(e, i)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <p>
                <label for="">Payment Type</label>
                <select name="payment_type" onChange={updateData}>
                  <option value="" selected disabled>
                    Payment Type
                  </option>
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                  <option value="onhold">Onhold</option>
                </select>
              </p>
              <p>
                <label for="">Remark</label>
                <input type="text" name="remark" onChange={updateData} />
              </p>
              <p>
                <label for="">Verified By</label>

                <input
                  type="text"
                  required
                  value={g.username}
                  onChange={updateData}
                />
              </p>
              <div>
                <button>Save Data</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
