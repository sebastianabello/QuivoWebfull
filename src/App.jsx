import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/customer/Home'
import Error from './pages/customer/Error'
import RoomDetail from "./pages/customer/RoomDetail";
import BookingDetail from "./pages/customer/BookingDetail";
import AllBookings from "./pages/customer/AllBookings";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error />} />
        <Route path="/" element={<Home />} />
        <Route path="/rooms/:code" element={<RoomDetail />} />
        <Route path="/booking/:reservationNumber" element={<BookingDetail />} />
        <Route path="/bookings" element={<AllBookings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
