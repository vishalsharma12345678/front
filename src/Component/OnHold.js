import { Sidebark } from "./Sidebar";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "./upcoming.css";

import { DatePicker, Space } from "antd";
export function OnHold({ user }) {
  async function handlePaymenttype(id) {
    const curUser = await axios.post(
      "http://localhost:4000/api/book/updateBookingEntryCredit",
      { id }
    );
    fetch();
  }
  const [billdata, setbilldata] = useState([]);

  async function fetch() {
    let billdataresult = await axios.get(
      `http://localhost:4000/api/holdbills/`
    );
    console.log(billdata);
    setbilldata(billdataresult.data);
  }
  useEffect(() => {
    fetch();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebark user={user} />
      <div
        className="rooms1 book1"
        style={{ position: "relative", left: "20%" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Room Booking Status</h1>
        </div>
        <table>
          <tr>
            <td>_id</td>
            <td>full_name</td>
            <td>registrationNo</td>
            <td>check_in</td>
            <td>CheckOut On</td>
            <td>Verfied By</td>
            <td>Total Amount</td>
            <td>Entry Status</td>
            <td>createdAt</td>
            <td>Actions</td>
          </tr>
          {billdata.map((bill) => {
            return (
              <tr>
                <td>{bill._id}</td>
                <td>{bill.full_name}</td>
                <td>{bill.registrationNo}</td>
                <td>{new Date(bill.check_in).toDateString()}</td>
                <td>{new Date(bill.check_out).toDateString()}</td>
                <td>{bill.verifiedby}</td>
                <td>{bill.price}</td>
                <td>
                  {
                    <select
                      name="payment_type"
                      onChange={(e) => handlePaymenttype(bill._id)}
                    >
                      <option
                        value="onhold"
                        selected={bill.payment_type === "onhold"}
                      >
                        Onhold
                      </option>
                      <option
                        value="credit"
                        selected={bill.payment_type === "credit"}
                      >
                        Credit
                      </option>
                    </select>
                  }
                </td>
                <td>{bill.createdAt}</td>
                <td>
                  <>
                    <NavLink to={`/EditRoom/${bill._id}`}>
                      <button
                        disabled={bill.status !== "booked" ? true : false}
                        style={{ cursor: `${bill.status !== "booked"}` }}
                      >
                        Edit
                      </button>
                    </NavLink>
                    {user.isAdmin === "Admin" ? <button>Delete</button> : ""}
                  </>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
}
