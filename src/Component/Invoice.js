import { useEffect, useState, useRef } from "react";
import { EyeOutlined } from "@ant-design/icons";
// import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table } from "antd";
import "./invoice.css";
import * as React from "react";
import { InputText } from "primereact/inputtext";

import { DatePicker } from "antd";
import { NavLink } from "react-router-dom";
import { Sidebark } from "./Sidebar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";

export function Invoice({ user }) {
  const dt = useRef(null);
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  const componentRef = useRef();
  const [popupModal, setPopupModal] = useState(false);
  const [billdata, setbilldata] = useState([]);
  const [selectguest, setSelectedguest] = useState([]);

  const [selectedBill, setSelectedBill] = useState(null);

  const getAllBills = async () => {
    const data = await axios.get("http://localhost:4000/api/book/invoices");
    console.log(data.data.result);
    setbilldata(data.data.result);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  // //useEffect
  useEffect(() => {
    getAllBills();
    //eslint-disable-next-line
  }, []);
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
    console.log(...billdata);
    let _products = [...billdata];
    let { newData, index } = e;
    console.log(newData, index);
    _products[index] = newData;

    setbilldata(_products);
  };

  const allowEdit = (rowData) => {
    return rowData.full_name !== "Blue Band";
  };
  const Action = (product) => {
    return (
      <div>
        <EyeOutlined
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedBill(product);
            setSelectedguest(product.bookingid.moreperson);
            setPopupModal(true);
          }}
        />
      </div>
    );
  };
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
          className="rooms book"
          style={{ position: "relative", width: "100%" }}
        >
          <button
            type="button"
            icon="pi pi-file"
            rounded
            onClick={() => exportCSV(false)}
            data-pr-tooltip="CSV"
          >
            Export
          </button>
          <DataTable
            value={billdata}
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
              field="updatedAt"
              header="Created Date"
              filter
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              filterPlaceholder="Search"
              style={{ width: "6rem" }}
              body={(products) => {
                return (
                  <div>{new Date(`${products.updatedAt}`).toDateString()}</div>
                );
              }}
            ></Column>
            <Column
              field="bookingid.full_name"
              header="Customer"
              filter
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              filterPlaceholder="Search"
              style={{ width: "8rem" }}
            ></Column>
            <Column
              field="op"
              header="Total tax"
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              style={{ width: "10%" }}
              body={(product) => {
                return <div>12%</div>;
              }}
            ></Column>
            <Column
              field="totalAmount"
              header="totalAmount"
              editor={(options) => cellEditor(options)}
              onCellEditComplete={onCellEditComplete}
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="check_in"
              header="Currency"
              style={{ width: "10%" }}
              body={"usd"}
            ></Column>
            <Column
              field="bookingid.payment_type"
              header="Payment Method"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="bookingid.status"
              header="Booking Status"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="bookingid.verifiedby"
              header="created by"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="check_in"
              header="Action"
              style={{ width: "10%" }}
              body={Action}
            ></Column>
            <Column
              rowEditor={allowEdit}
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          </DataTable>
          {popupModal && (
            <Modal
              width="100%"
              pagination={true}
              title="Invoice Details"
              visible={true}
              onCancel={() => {
                setPopupModal(false);
              }}
              footer={false}
            >
              {/* ============ invoice modal start ==============  */}
              <div id="invoice-POS" ref={componentRef}>
                <div style={{ border: "3px solid black" }}>
                  <div>
                    <center id="top">
                      <div className="info">
                        <h2>INVOICE</h2>
                      </div>
                      {/*End Info*/}
                    </center>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div id="top">
                        <div className="logo">
                          <img
                            src="./Image20231227194112.png"
                            alt=""
                            srcset=""
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: "end", fontWeight: "bold" }}>
                        <h1
                          style={{
                            fontFamily: "Dancing Script, cursive",
                            fontWeight: "900",
                            fontStyle: "normal",
                            fontSize: "2.5rem",
                          }}
                        >
                          off days maldives Pvt. Ltd
                        </h1>
                        <p style={{ color: "black" }}>
                          H.Hiriyaadhoo, Filigushigun, Male’, Republic of
                          Maldives
                        </p>
                        <p style={{ color: "black" }}>
                          Tele: 3304838, Mobile: 7738484, Fax: 3004839, E-mail:
                          sales@offdaymaldives.com
                        </p>
                        <p style={{ color: "black" }}>
                          www.offdaymaldives.com, Reg: c/0006/2010
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "3px solid black",
                      borderBottom: "3px solid black",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        width: "30%",
                        fontWeight: "600",
                        color: "black",
                        margin: 0,
                        fontSize: "12px",
                      }}
                    >
                      GST Tin: 1017741GST002
                    </p>
                    <p
                      style={{
                        width: "70%",
                        fontWeight: "800",
                        color: "black",
                        borderLeft: "1px solid black",
                        margin: 0,
                        fontSize: "14px",
                      }}
                    >
                      TAX INVOICE
                    </p>
                  </div>
                  {/*End InvoiceTop*/}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      padding: "10px 20px",
                    }}
                  >
                    <div style={{ width: "40%", textAlign: "end" }}>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Date:{" "}
                        <span>
                          {new Date(selectedBill.createdAt).toDateString()}
                        </span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Place: <span>Emerald Maldives Resort & Spa</span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        TIN:: <span>[MIRA GST-tin number: 1068108GST001]</span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        ADDRESS:{" "}
                        <span>
                          Fasmendhoo Island, Fasmendhoo Male', Rep of Maldives
                        </span>
                      </p>
                    </div>
                    <div style={{ width: "40%" }}>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        INVOICE No: <span> {selectedBill.invoiceNumber}</span>
                      </p>
                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        Folio No:: <span> 466</span>
                      </p>

                      <p
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Voucher No: <span>{selectedBill._id} </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <div>
                      <table
                        className="invoicetable"
                        style={{
                          width: "100%",
                          borderCollapse: "collapse",
                          border: "1px solid black",
                        }}
                      >
                        <tr>
                          <th>From</th>
                          <th>to</th>
                          <th>DESCRIPTION</th>
                          <th>Basic</th>
                          <th>plan</th>
                          <th>days</th>
                          <th>Rooms</th>
                          <th>Rate USD</th>
                          <th>Total USD</th>
                        </tr>
                        <tr>
                          <td>
                            {new Date(
                              selectedBill.bookingid.check_in
                            ).toDateString()}
                          </td>
                          <td>
                            {new Date(
                              selectedBill.bookingid.check_out
                            ).toDateString()}
                          </td>
                          <td style={{ padding: "0" }}>
                            {/* <p>MR. {selectedBill.bookingid.full_name}</p>
                          <p>PPNO: p3789119</p>
                          <p>WPNO:{selectedBill.bookingid.ww_no}</p> */}

                            <table>
                              {selectguest.map((guest) => {
                                return (
                                  <>
                                    <tr
                                      style={{
                                        border: "none",
                                      }}
                                    >
                                      <td
                                        style={{
                                          border: "none",
                                          borderBottom: "2px solid black",
                                          padding: "0",
                                        }}
                                      >
                                        <p>Name: {guest.name}</p>
                                        <p>ID : {guest.wp_pass}</p>
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </table>
                          </td>
                          <td>SGL</td>
                          <td>{selectedBill.bookingid.meal_plan}</td>
                          <td>
                            {days(
                              new Date(selectedBill.bookingid.check_in),
                              new Date(selectedBill.bookingid.check_out)
                            )}
                          </td>
                          <td>{selectedBill.bookingid.room_number.length}</td>

                          <td>
                            {selectedBill.bookingid.price *
                              days(
                                new Date(selectedBill.bookingid.check_in),
                                new Date(selectedBill.bookingid.check_out)
                              ) +
                              (selectedBill.bookingid.adultNo % 4) ===
                            0
                              ? 1
                              : selectedBill.bookingid.adultNo / 4}
                          </td>
                          <td>
                            {selectedBill.totalAmount}
                            .00
                          </td>
                        </tr>

                        <tr>
                          <td
                            style={{ textAlign: "center", padding: "0" }}
                            colSpan={8}
                          >
                            BILLING TOTAL (USD)
                          </td>
                          <td style={{ textAlign: "center", padding: "0" }}>
                            {"$" + selectedBill.totalAmount}
                            .00
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={8}></td>
                        </tr>
                        <tr>
                          <td
                            colSpan={8}
                            style={{ textAlign: "center", padding: "0" }}
                          >
                            12.0% T.G.S.Tax (Tin: 1017741GST002)
                          </td>
                          <td style={{ textAlign: "center", padding: "0" }}>
                            $5.68
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{ textAlign: "center", padding: "0" }}
                            colSpan={8}
                          >
                            TOTAL BILLING:(USD)
                          </td>
                          <td style={{ textAlign: "center", padding: "0" }}>
                            {"$" +
                              selectedBill.bookingid.price *
                                days(
                                  new Date(selectedBill.bookingid.check_in),
                                  new Date(selectedBill.bookingid.check_out)
                                ) *
                                selectedBill.bookingid.adultNo}
                            .00
                          </td>
                        </tr>
                      </table>
                      <p style={{ border: "1px solid black", padding: "5px" }}>
                        <span>
                          Any complain/issue regarding this bill should be
                          informed/settled within 3 days.
                        </span>
                        <br />
                        <span>
                          Total amount should be paid on or before 30 days on
                          receiving of this invoice.
                        </span>
                        <br />
                        <span>
                          3% interest will be addeded to the total amount for
                          each delayed day.
                        </span>
                        <br />
                        <span>
                          Cheque should be drawn in Favour of Off Day Maldives
                          Pvt Ltd.
                        </span>
                        <br />
                      </p>
                      <p style={{ border: "1px solid black", padding: "10px" }}>
                        <p>Payment Tranfer Account Details</p>
                        <table style={{ border: "1px solid black" }}>
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              Account Name:
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              Off Day Maldives Pvt. Ltd
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              Account NUmber:
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              7730000020264
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              Bank Name:
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              Bank Of Maldives
                            </td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid black" }}>
                              Currency
                            </td>
                            <td style={{ border: "1px solid black" }}>
                              US Dollar (USD)
                            </td>
                          </tr>
                        </table>
                      </p>
                    </div>
                    <div>
                      <table className="footer" width="100%">
                        <tr>
                          <th>Azumsth</th>
                          <th>Mariyam</th>
                          <th>{selectedBill.bookingid.verifiedby}</th>
                        </tr>
                        <tr>
                          <td>Created by:</td>
                          <td>Checked by:</td>
                          <td>Approved by:</td>
                        </tr>
                      </table>
                    </div>
                    {/*End Table*/}
                    <div>
                      <p style={{ textAlign: "center" }}>
                        <strong>Thank you for Chooshing off days inn!</strong>
                      </p>
                    </div>
                  </div>
                  {/*End InvoiceBot*/}
                </div>
              </div>
              {/*End Invoice*/}
              <div className="d-flex justify-content-end mt-3">
                <Button type="primary" onClick={handlePrint}>
                  Print
                </Button>
              </div>
              {/* ============ invoice modal ends ==============  */}
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
function days(i, j) {
  let Difference_In_Time = i.getTime() - j.getTime();
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
  return Math.abs(Difference_In_Days) + 1;
}
