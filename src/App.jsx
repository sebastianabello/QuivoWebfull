import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/customer/Home'
import Error from './pages/customer/Error'
import RoomDetail from "./pages/customer/RoomDetail";
import BookingDetail from "./pages/customer/BookingDetail";
import AllBookings from "./pages/customer/AllBookings";
import EditBooking from './pages/customer/EditBooking.tsx';
import RoomList from './pages/admin/RoomList.tsx';
import CreateRoom from './pages/admin/CreateRoom.tsx';
import EditRoom from './pages/admin/EditRoom.tsx';
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from './components/AdminRoute.tsx';
import Unauthorized from './pages/errors/Unauthorized';


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
        <Route
          path="/booking/edit/:reservationNumber"
          element={
            <PrivateRoute>
              <EditBooking />
            </PrivateRoute>
          }
        />


        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <RoomList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/create"
          element={
            <AdminRoute>
              <CreateRoom />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/edit/:code"
          element={
            <AdminRoute>
              <EditRoom />
            </AdminRoute>
          }
        />



        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

