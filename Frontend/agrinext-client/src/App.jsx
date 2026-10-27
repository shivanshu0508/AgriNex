import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import AddEquipment from "./pages/AddEquipment";
import Booking from "./pages/Booking";
import BookingConfirmation from "./pages/BookingConfirmation";
import EquipmentDetails from "./pages/EquipmentDetails";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerProfile from "./pages/FarmerProfile";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerEarnings from "./pages/OwnerEarnings";
import OwnerEquipment from "./pages/OwnerEquipment";
import Register from "./pages/Register";
import RentalRequests from "./pages/RentalRequests";
import OwnerSettings from "./pages/OwnerSettings";
import RequireAuth from "./auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Equipment Page */}
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetails />} />
          <Route element={<RequireAuth role="farmer" />}>
            <Route path="/equipment/:id/booking" element={<Booking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          </Route>

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer flows */}
          <Route element={<RequireAuth role="farmer" />}>
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/profile" element={<FarmerProfile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Route>

          {/* Equipment owner flows */}
          <Route element={<RequireAuth role="owner" />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/equipment" element={<OwnerEquipment />} />
            <Route path="/owner/add-equipment" element={<AddEquipment />} />
            <Route path="/owner/requests" element={<RentalRequests />} />
            <Route path="/owner/earnings" element={<OwnerEarnings />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;