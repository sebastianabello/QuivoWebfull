import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/customer/Home'
import Error from './pages/customer/Error'
import RoomDetail from "./pages/customer/RoomDetail";
import BookingDetail from "./pages/customer/BookingDetail";
import AllBookings from "./pages/customer/AllBookings";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms/:code" element={<RoomDetail />} />


        {/* Rutas protegidas */}
        <Route
          path="/booking/:reservationNumber"
          element={
            <PrivateRoute>
              <BookingDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <PrivateRoute>
              <AllBookings />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

