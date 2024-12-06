import { BrowserRouter, Route, Routes, path, Navigate } from "react-router-dom";
import { Home } from "./Component/Home";
import { Login } from "./Component/login";
import { NewBooking } from "./Component/newBooking";
import { NewRoom } from "./Component/Addnewroom";
import { RoomInvertory } from "./Component/RoomInverntory";
import { RoomLocked } from "./Component/RoomLocked";
import { Booking } from "./Component/BookedBoom";
import { UpdateBooking } from "./Component/updatebooking";
import { Upcoming } from "./Component/BookedRoomCOmponet";
import { Invoice } from "./Component/Invoice";
import { User } from "./Component/Users";
import { LastFragment } from "./Component/Fragment/LastFragemnt";
import { OngoingFragemnt } from "./Component/Fragment/OngoingFragemnt";
import { UpcomingFragment } from "./Component/Fragment/UpcomingFragment";
import { RoomType } from "./Component/RoomType";
import { Guest } from "./Component/Guest";
import { Test } from "./Component/Fragment/Test";
import { OnHold } from "./Component/OnHold";
import { PrimeReactProvider } from "primereact/api";
export function Locations({ user }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          exact
          element={
            <ProtectedRoute1>
              <Login />
            </ProtectedRoute1>
          }
        />
        <Route
          path="/"
          exact
          element={
            <ProtectedRoute>
              <Home user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RoomType"
          exact
          element={
            <ProtectedRoute>
              <ProtectedRoute2 data={"Roomtype"}>
                <RoomType user={user} />
              </ProtectedRoute2>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test"
          exact
          element={
            <PrimeReactProvider>
              <Test user={user} />
            </PrimeReactProvider>
          }
        />
        <Route
          path="/newbooking"
          exact
          element={
            <ProtectedRoute>
              <ProtectedRoute2 data={"booking"}>
                <NewBooking user={user} />
              </ProtectedRoute2>
            </ProtectedRoute>
          }
        />
        <Route
          path="/newRoom"
          exact
          element={
            <ProtectedRoute>
              <ProtectedRoute2 data={"addRoom"}>
                <NewRoom user={user} />
              </ProtectedRoute2>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roomInventory"
          exact
          element={
            <ProtectedRoute>
              <RoomInvertory user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roomsLocked"
          exact
          element={
            <ProtectedRoute>
              <ProtectedRoute2 data={"lockedRoom"}>
                <RoomLocked user={user} />
              </ProtectedRoute2>
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookedroom"
          exact
          element={
            <ProtectedRoute>
              <Upcoming user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditRoom/:id"
          exact
          element={
            <ProtectedRoute>
              <UpdateBooking user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lastbooking"
          exact
          element={
            <ProtectedRoute>
              <LastFragment user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ongoing"
          exact
          element={
            <ProtectedRoute>
              <OngoingFragemnt user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onholdsbills"
          exact
          element={
            <ProtectedRoute>
              <OnHold user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upcoming"
          exact
          element={
            <ProtectedRoute>
              <UpcomingFragment user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice"
          exact
          element={
            <ProtectedRoute>
              <Invoice user={user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/userdata"
          exact
          element={
            <ProtectedRoute>
              <ProtectedRoute2 data={"Users"}>
                <User user={user} />
              </ProtectedRoute2>
            </ProtectedRoute>
          }
        />
        <Route path="/guest" exact element={<Guest user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
function ProtectedRoute({ children }) {
  if (localStorage.getItem("user")) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

function ProtectedRoute2({ children, data }) {
  if (
    localStorage.getItem("user") &&
    JSON.parse(localStorage.getItem("user"))[data]
  ) {
    return children;
  } else {
    alert("Don't Access of this");
    return <Navigate to="/" />;
  }
}

function ProtectedRoute1({ children }) {
  if (!localStorage.getItem("user")) {
    return children;
  } else return <Navigate to="/" />;
}
