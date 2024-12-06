import * as React from "react";
import { InputText } from "primereact/inputtext";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DatePicker } from "antd";
import { NavLink } from "react-router-dom";
import { Sidebark } from "../Sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";

// import "../upcoming.css";

const { RangePicker } = DatePicker;
export function LastFragment({ user }) {
  const dt = useRef(null);
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  const [rooms, setRooms] = useState([]);
  const [isFetching, setFetching] = useState(false);
  async function handleEdit(e, id, currentbookingid) {
    // setFetching(true);
    const ids = {
      bookingid: id,
      roomsid: currentbookingid,
    };
    let roomsdata = await axios.post(
      `http://localhost:4000/api/book/updateBooking`,
      ids
    );
    fetchData();

    // setFetching(false);
  }
  async function handleEdit1(e, id, payment_type) {
    // setFetching(true);
    const ids = {
      bookingid: id,
      value: e.target.value,
    };
    if (payment_type === "onhold") {
      console.log("first");
      let roomsdata = await axios.post(
        `http://localhost:4000/api/book/updateBookingEntryhold`,
        ids
      );
    } else {
      let roomsdata = await axios.post(
        `http://localhost:4000/api/book/updateBookingEntry`,
        ids
      );
    }
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
    setRooms((s) => data.Lastbooking);
    setFetching(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  async function filterByDate(dates) {
    if (dates) {
      let rooms = await axios.post(
        "http://localhost:4000/api/book/allBookingswithdate",
        {
          check_in: dates[0],
          check_out: dates[1],
        }
      );
      console.log(dates);
      console.log(dates[0] + " " + dates[1]);
      console.log(rooms);
      setRooms(rooms.data.Lastbooking);
    } else {
      fetchData();
    }
  }
  const statusBodyTemplate = (product) => {
    return (
      <select
        name="status"
        disabled={
          product.check_in_check_out === "Checkedout" ||
          product.status !== "booked"
            ? true
            : false
        }
        onChange={(e) => handleEdit1(e, product._id, product.payment_type)}
      >
        <option
          value="Checkedin"
          selected={product.check_in_check_out === "Checkedin"}
        >
          Checkedin
        </option>
        <option
          value="Checkedout"
          selected={product.check_in_check_out === "Checkedout"}
        >
          CheckedOut
        </option>
        <option
          value="waiting to checkin"
          disabled
          selected={product.check_in_check_out === "waiting to checkin"}
        >
          Waiting to checkIn
        </option>
      </select>
    );
  };
  const Booking_status = (product) => {
    return (
      <select
        name="status"
        disabled={
          product.status !== "booked" ||
          product.check_in_check_out === "Checkedin" ||
          product.check_in_check_out === "Checkedout"
            ? true
            : false
        }
        onChange={(e) => handleEdit(e, product._id, product.currentbooking)}
      >
        <option value="" selected={product.status === "booked"}>
          Booked
        </option>
        <option value="" selected={product.status !== "booked"}>
          Canceled
        </option>
      </select>
    );
  };
  const Action = (product) => {
    return (
      <>
        <NavLink to={`/EditRoom/${product._id}`}>
          <button style={{ cursor: `${product.status !== "booked"}` }}>
            Edit
          </button>
        </NavLink>
        {user.isAdmin === "Admin" ? (
          <button onClick={() => DeleteRoom(product._id)}>Delete</button>
        ) : (
          ""
        )}
      </>
    );
  };
  const cellEditor = (options) => {
    // if (options.field === "price") return priceEditor(options);
    return textEditor(options);
  };

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    if (newValue.trim().length > 0) rowData[field] = newValue;
    else event.preventDefault();
  };
  const onRowEditComplete = (e) => {
    let _products = [...rooms];
    let { newData, index } = e;

    _products[index] = newData;

    setRooms(_products);
  };

  const allowEdit = (rowData) => {
    return rowData.full_name !== "Blue Band";
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebark user={user} />
      <div
        className="rooms1 book1"
        style={{ position: "relative", left: "20%" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>Room Booking Status</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <RangePicker
              style={{ height: "38px" }}
              onChange={filterByDate}
              format="DD-MM-YYYY"
              className="m-2"
            />
          </div>
        </div>
        <button
          type="button"
          icon="pi pi-file"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        >
          Export
        </button>
        <div className={"card p-fluid"} style={{ height: 600, width: "100%" }}>
          <DataTable
            value={rooms}
            paginator
            rows={5}
            ref={dt}
            onRowEditComplete={onRowEditComplete}
            editMode="row"
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="_id"
              header="_id"
              filter
              filterPlaceholder="Search"
              style={{ width: "6rem" }}
            ></Column>
            <Column
              field="full_name"
              header="full_name"
              filter
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              filterPlaceholder="Search"
              style={{ width: "6rem" }}
            ></Column>
            <Column
              field="registrationNo"
              header="Reg No."
              filter
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              filterPlaceholder="Search"
              style={{ width: "8rem" }}
            ></Column>
            <Column
              field="check_in"
              header="Checked In"
              style={{ width: "12%" }}
              body={(products) => {
                return (
                  <div>{new Date(`${products.check_in}`).toDateString()}</div>
                );
              }}
            ></Column>
            <Column
              field="check_out"
              header="Expected Checkout"
              style={{ width: "12%" }}
              body={(products) => {
                return (
                  <div>{new Date(`${products.check_out}`).toDateString()}</div>
                );
              }}
            ></Column>
            <Column
              field="verifiedby"
              header="Verfied By"
              style={{ width: "5%" }}
            ></Column>
            <Column
              field="remark"
              header="Reamrk"
              style={{ width: "5%" }}
            ></Column>
            <Column
              field="Ram"
              header="Entry Status"
              body={statusBodyTemplate}
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="databasePkey"
              header="Booking Status"
              body={Booking_status}
            ></Column>
            <Column
              field="createdAt"
              header="Created At"
              style={{ width: "12%" }}
              body={(products) => {
                return (
                  <div>{new Date(`${products.createdAt}`).toDateString()}</div>
                );
              }}
            ></Column>
            <Column
              field="#"
              header="Action"
              body={Action}
              style={{ width: "15%" }}
            ></Column>
            <Column
              rowEditor={allowEdit}
              headerStyle={{ width: "5%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
