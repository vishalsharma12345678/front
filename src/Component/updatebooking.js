import { useEffect, useState } from "react";
import { Sidebark } from "./Sidebar";
import { Opions } from "./options";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/bootstrap.css";
import "./newboing.css";
import Select from "react-select";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
export function UpdateBooking({ user1 }) {
  const user = localStorage.getItem("user");
  const g = JSON.parse(user);
  let { id } = useParams();
  let navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [wpps, setWpps] = useState(false);
  const [check_in, setCheck_in] = useState();
  const [check_out, setcheck_out] = useState();
  const [rooms, setRooms] = useState([]);
  const [data, setData] = useState({});
  const [phone, setPhone] = useState(0);
  const [room, setRoom] = useState();

  const [guests, setGuests] = useState([]);
  function handlerCheckIn(e) {
    setCheck_in((a) => e.target.value);
  }
  async function handlerCheckOut(e) {
    let rooms = await fetch(
      "http://localhost:4000/api/room/getallroomsAvalible"
    );
    let data = await rooms.json();
    console.log(data);
    console.log(check_in + " " + check_out);
    let g = [];
    Array.from(data).forEach((item) => {
      let availability = <tr></tr>;
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
  const [checkindate, setcheckindate] = useState(new Date());
  const [checkcheckoutdate, setcheckoutdate] = useState(new Date());

  function handleraddGuest(e) {
    e.preventDefault();
    setGuests((items) => [...items, {}]);
  }
  const updateData = (e) => {
    if (e.target.name === "adultNo") {
      setData((s) => ({ ...s, [e.target.name]: e.target.value }));
      setData((s) => ({
        ...s,
        ["room_number"]: rooms.slice(0, Math.ceil(e.target.value / 4)),
      }));
      return;
    } else if (e.target.name === "adultCharges") {
      setData((s) => ({ ...s, [e.target.name]: e.target.checked }));
      return;
    }
    setData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };
  const updateData1 = (e) => {
    setData((s) => ({
      ...s,
      ["price"]: Number(room[0].rate_type_name) + room[0][e.target.value],
    }));
  };
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
    const fullData = { ...data };
    console.log(fullData);
    const curUser = await axios.post(
      "http://localhost:4000/api/book/updatebookingdetails",
      fullData
    );
    // console.log(curUser);
    navigate("/ongoing");
    // window.location.href = "/";
  }
  async function fetchdata() {
    const booking = await axios.get(
      `http://localhost:4000/api/book/allbooking/${id}`
    );
    let book = booking.data;
    const { moreperson, ...rest } = book;
    setData(rest);
    setcheckindate(new Date(rest.check_in).toISOString().split("T")[0]);
    setcheckoutdate(new Date(rest.check_out).toISOString().split("T")[0]);
    setGuests(moreperson);
    setRoom([rest.room_number]);
  }

  useEffect(() => {
    fetchdata();
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
                alignItems: "center",
              }}
            >
              <h1 style={{ width: "100%" }}>UPDATE BOOKING</h1>

              <p>
                <label htmlFor="">Reg No</label>
                <br />
                <input
                  type="text"
                  value={data.registrationNo}
                  required
                  name="registrationNo"
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Invoice No.</label>
                <br />
                <input
                  type="text"
                  value={data.invoice_No}
                  required
                  name="invoice_No"
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Log No.</label>
                <br />
                <input
                  type="number"
                  value={data.log_No}
                  name="log_No"
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">check in</label>
                <br />
                <input
                  type="date"
                  name="check_in"
                  value={checkindate}
                  required
                  onChange={(e) => {
                    handlerCheckIn(e);
                    updateData(e);
                  }}
                />
              </p>
              <p>
                <label htmlFor="">Expected Check out</label>
                <br />
                <input
                  type="date"
                  name="check_out"
                  value={checkcheckoutdate}
                  required
                  onChange={(e) => {
                    setcheck_out(e.target.value);
                    updateData(e);
                  }}
                />
              </p>
              <p>
                <label htmlFor="">Room Type</label>
                <br />
                <select
                  name="room_type"
                  required
                  onChange={(e) => {
                    handlerCheckOut();
                    updateData(e);
                  }}
                >
                  <option value="">choose...</option>
                  <option value="Standard" selected>
                    Standard Room
                  </option>
                </select>
              </p>
              <p>
                <label htmlFor="">No of Pax</label>
                <div style={{ display: "flex", width: "100%" }}>
                  <input
                    type="text"
                    required
                    style={{ width: "40%" }}
                    name="adultNo"
                    value={data.adultNo}
                    onChange={(e) => (
                      updateData(e),
                      Math.ceil(e.target.value / 4) > rooms.length
                        ? setData((s) => ({ ...s, [e.target.name]: "" }))
                        : ""
                    )}
                    placeholder="no of adult"
                  />
                  <input
                    type="text"
                    style={{ width: "40%" }}
                    name="children"
                    required
                    value={data.children}
                    onChange={updateData}
                    placeholder="no of child"
                  />
                  <input
                    type="checkbox"
                    name="adultCharges"
                    checked={data.adultCharges}
                    onChange={updateData}
                    id=""
                  />
                </div>
              </p>
              <p>
                <label htmlFor="">Room Number</label>
                <br />
                <select
                  name="room_number"
                  onChange={(e) => (
                    updateData(e), handlerChange(e.target.value)
                  )}
                >
                  <option value="">choose...</option>
                  {rooms.length === 0
                    ? // <option selected>{room._id}</option>
                      ""
                    : rooms.map((room) => {
                        return (
                          <option
                            value={room._id}
                            selected={data.room_number === room._id}
                          >
                            {room.roomNo}
                          </option>
                        );
                      })}
                </select>
              </p>
              <p>
                <label htmlFor="">Meal Plan</label>
                <br />
                <select
                  name="meal_plan"
                  required
                  onChange={(e) => {
                    updateData(e);
                  }}
                >
                  <option value="" disabled>
                    choose...
                  </option>
                  <option
                    value="room_only"
                    selected={data.meal_plan === "room_only"}
                  >
                    Room Only
                  </option>
                  <option
                    value="breakfast_price"
                    selected={data.meal_plan === "breakfast_price"}
                  >
                    Bed & BreakFast
                  </option>
                  <option
                    value="lunch_price"
                    selected={data.meal_plan === "lunch_price"}
                  >
                    Lunch Only
                  </option>
                  <option
                    value="dinner_price"
                    selected={data.meal_plan === "dinner_price"}
                  >
                    Dinner Only{" "}
                  </option>
                  <option
                    value="breakfast_lunch"
                    selected={data.meal_plan === "breakfast_lunch"}
                  >
                    Breakfast and Lunch
                  </option>
                  <option
                    value="lunch_dinner"
                    selected={data.meal_plan === "lunch_dinner"}
                  >
                    Lunch and Dinner
                  </option>
                  <option
                    value="dinner_breakfast"
                    selected={data.meal_plan === "dinner_breakfast"}
                  >
                    Dinner Breakfast
                  </option>
                  <option
                    value="full_board"
                    selected={data.meal_plan === "full_board"}
                  >
                    Full Board
                  </option>
                </select>
              </p>
              <p>
                <label htmlFor="">Guest Basis</label>
                <br />
                <select required name="guest_basis" onChange={updateData}>
                  <option value="" disabled selected>
                    choose...
                  </option>
                  <option
                    value="direct booking"
                    selected={data.guest_basis === "direct booking"}
                  >
                    Direct booking
                  </option>
                  <option value="fit" selected={data.guest_basis === "fit"}>
                    FIT
                  </option>
                  <option value="OTA" selected={data.guest_basis === "OTA"}>
                    OTA
                  </option>
                </select>
              </p>
              <p>
                <label htmlFor="">Guest Type</label>
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
                  <option value="local" selected={data.guest_type === "local"}>
                    Local
                  </option>
                  <option
                    value="work_permit"
                    selected={data.guest_type === "work_permit"}
                  >
                    Work Permit
                  </option>
                  <option
                    value="tourist"
                    selected={data.guest_type === "tourist"}
                  >
                    Tourist
                  </option>
                </select>
              </p>
              <div style={{ width: "32.33%" }}>
                <p style={{ margin: 0 }}>
                  <label htmlFor="">bill to</label>
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
                    checked={data.bill_to === "customer"}
                    onChange={(e) => {
                      setDisabled(true);
                      updateData(e);
                      if (data.bill_to !== "company" || !disabled) {
                        setData((s) => ({ ...s, ["company_name"]: "" }));
                      }
                    }}
                  />
                  <label htmlFor="customer">Customer</label>
                  <input
                    type="radio"
                    name="bill_to"
                    required
                    checked={data.bill_to === "company"}
                    onChange={(e) => {
                      setDisabled(false);
                      updateData(e);
                    }}
                    value="company"
                  />
                  <label htmlFor="company">Company</label>
                </div>
              </div>
              <p>
                <label htmlFor="">Company Name</label>
                <input
                  type="text"
                  required
                  name="company_name"
                  value={data.company_name}
                  disabled={
                    data.bill_to !== "company" || disabled ? true : false
                  }
                  onChange={(e) => {
                    updateData(e);
                  }}
                />
              </p>
              <p>
                <label htmlFor="">Full Name</label>
                <input
                  type="text"
                  required
                  name="full_name"
                  value={data.full_name}
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  required
                  name="email"
                  value={data.email}
                  onChange={updateData}
                />
              </p>
              {/* <p>
              <label htmlFor="">Mobile number</label>
              <PhoneInput
                country={"eg"}
                enableSearch={true}
                value={phone}

                onChange={(phone1) => (
                  setPhone((s) => phone1),
                  setData((s) => ({ ...s, ["phone"]: phone1 }))
                )}
                
              />
            </p> */}
              <p>
                <label htmlFor="">WP/ND</label>
                <input
                  type="text"
                  name="wp_nd"
                  disabled={wpps}
                  value={data.wp_nd}
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Passport</label>
                <input
                  type="text"
                  disabled={!wpps}
                  // disabled={data.passport_number !== undefined ? false : true}
                  value={data.passport_number}
                  name="passport_number"
                  onChange={updateData}
                />
              </p>

              <p>
                <label htmlFor="">Natinality</label>
                <select
                  name="nationality"
                  defaultValue={data.nationality}
                  required
                  onChange={updateData}
                >
                  <Opions />
                  <option value={data.nationality} selected>
                    {data.nationality}
                  </option>
                </select>
              </p>
              <p>
                <label htmlFor="">Country of Residence</label>
                <select name="country_residence" required onChange={updateData}>
                  <option value={data.country_residence} selected>
                    {data.country_residence}
                  </option>

                  <Opions />
                </select>
              </p>
              <p>
                <label htmlFor="">D.O.B</label>
                <input
                  type="date"
                  name="dob"
                  value={data.dob}
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Profession</label>
                <input
                  type="text"
                  name="proffesion"
                  value={data.proffesion}
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Group</label>
                <div style={{ display: "flex", width: "100%" }}>
                  <select name="group" required onChange={updateData}>
                    <option value="no" selected={data.group === "no"}>
                      no
                    </option>
                    <option value="yes" selected={data.group === "yes"}>
                      yes
                    </option>
                  </select>
                </div>
              </p>
              <p>
                <label htmlFor="">Upload Id</label>
                <input
                  type="file"
                  name=""
                  style={{ border: "1px solid black" }}
                />
              </p>
              <p>
                <button onClick={(e) => handleraddGuest(e)}>
                  Add More Guest
                </button>
              </p>
              {/* {guests.map((guest, i) => {
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
                  <input
                    type="text"
                    placeholder="name"
                    required
                    value={guest.name}
                    disabled
                    name="name"
                    onChange={(e) => updateGuest(e, i)}
                  />
                  <input
                    type="date"
                    name="dob"
                    required
                    disabled
                    value={guest.dob}
                    onChange={(e) => updateGuest(e, i)}
                  />
                  <input
                    type="number"
                    name="wp_pass"
                    required
                    disabled
                    value={guest.wp_pass}
                    placeholder="wp/passport"
                    onChange={(e) => updateGuest(e, i)}
                  />
                  <select
                    name="nationality"
                    required
                    disabled
                    value={guest.nationality}
                    onChange={(e) => updateGuest(e, i)}
                  >
                    <Opions />
                  </select>
                  <input type="file" />
                  <a href="">Remove</a>
                </div>
              );
            })} */}

              <p>
                <label htmlFor="">Payment Type</label>
                <select name="payment_type" onChange={updateData}>
                  <option value="" selected disabled>
                    Payment Type
                  </option>
                  <option value="cash" selected={data.payment_type === "cash"}>
                    Cash
                  </option>
                  <option
                    value="credit"
                    selected={data.payment_type === "credit"}
                  >
                    Credit
                  </option>
                  <option
                    value="onhold"
                    selected={data.payment_type === "onhold"}
                  >
                    Onhold
                  </option>
                </select>
              </p>
              <p>
                <label htmlFor="">Remark</label>
                <input
                  type="text"
                  name="remark"
                  value={data.remark}
                  onChange={updateData}
                />
              </p>
              <p>
                <label htmlFor="">Verified By</label>

                <input
                  type="text"
                  required
                  value={data.verifiedby}
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
