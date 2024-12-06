import { useEffect, useState } from "react";

import "./index.css";

export function Sidebark({ user }) {
  const [data, setdata] = useState(false);
  useEffect(() => {
    console.log(JSON.parse(localStorage.getItem("user")).Roomtype);
    setdata(
      JSON.parse(localStorage.getItem("user")).isAdmin === "Admin" ||
        JSON.parse(localStorage.getItem("user")).Roomtype
        ? true
        : false
    );
  }, []);
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCompactDashboard, setCompactDashboard] = useState(false);

  const toggleMobileNav = () => {
    if (window.innerWidth <= 990) {
      setMobileNavOpen(!isMobileNavOpen);
    } else {
      setCompactDashboard(!isCompactDashboard);
    }
  };

  const handleDropdownToggle = (e) => {
    const dropdown = e.currentTarget.closest(".dashboard-nav-dropdown");
    const siblings = dropdown.parentElement.children;
    for (let sibling of siblings) {
      if (sibling !== dropdown) {
        sibling.classList.remove("show");
      }
    }
    dropdown.classList.toggle("show");
  };
  return (
    <div className=" k dashboard-nav" style={{ width: "20%" }}>
      <header>
        <div className="menu-toggle" onClick={toggleMobileNav}>
          <i className="fas fa-bars"></i>
        </div>
        <a href="#" className="brand-logo">
          <img src="/Image20231227194121.jpg"></img>
        </a>
      </header>
      <nav className={`dashboard-nav-list`}>
        <a href="/" className="dashboard-nav-item">
          <i className="fas fa-home"></i> DashBoard
        </a>

        <div className="dashboard-nav-dropdown">
          <a
            href="#!"
            className="dashboard-nav-item dashboard-nav-dropdown-toggle"
            onClick={handleDropdownToggle}
          >
            <i className="fas fa-photo-video"></i> Booking
          </a>
          <div className="dashboard-nav-dropdown-menu">
            <a href="/newbooking" className="dashboard-nav-dropdown-item">
              Create New
            </a>
            <a href="/lastbooking" className="dashboard-nav-dropdown-item">
              Last Booking
            </a>
            <a href="/ongoing" className="dashboard-nav-dropdown-item">
              Ongoing Booking
            </a>
            <a href="/upcoming" className="dashboard-nav-dropdown-item">
              Upcoming Booking
            </a>
          </div>
        </div>
        <div className="dashboard-nav-dropdown">
          <a
            href="#!"
            className="dashboard-nav-item dashboard-nav-dropdown-toggle"
            onClick={handleDropdownToggle}
          >
            <i className="fas fa-photo-video"></i> Invoice
          </a>
          <div className="dashboard-nav-dropdown-menu">
            <a href="/invoice" className="dashboard-nav-dropdown-item">
              Create Invoice
            </a>
            <a href="/onholdsbills" className="dashboard-nav-dropdown-item">
              On Hold Bills
            </a>
          </div>
        </div>
        {data ? (
          <div className="dashboard-nav-dropdown">
            <a
              href="#!"
              className="dashboard-nav-item dashboard-nav-dropdown-toggle"
              onClick={handleDropdownToggle}
            >
              <i className="fas fa-photo-video"></i> Rooms
            </a>
            <div className="dashboard-nav-dropdown-menu">
              <a href="/RoomType" className="dashboard-nav-dropdown-item">
                Room Type
              </a>
              <a href="/roomInventory" className="dashboard-nav-dropdown-item">
                Rooms Inventory
              </a>
              <a href="/roomsLocked" className="dashboard-nav-dropdown-item">
                Locked Rooms
              </a>
              <a href="/newRoom" className="dashboard-nav-dropdown-item">
                Add New Room
              </a>
            </div>
          </div>
        ) : null}
        <a href="/guest" className="dashboard-nav-item">
          <i className="fas fa-home"></i> Guests
        </a>

        {data ? (
          <a href="/userdata" className="dashboard-nav-item">
            <i className="fas fa-home"></i> Users
          </a>
        ) : (
          ""
        )}
      </nav>
    </div>
  );
}
