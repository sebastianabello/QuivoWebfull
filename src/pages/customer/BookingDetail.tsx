import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";

export default function BookingDetail() {
  const { reservationNumber } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8989/bookings/api/bookings/${reservationNumber}`)
      .then(res => res.json())
      .then(data => setBooking(data))
      .catch(err => console.error("Error cargando reserva", err))
      .finally(() => setLoading(false));
  }, [reservationNumber]);

  if (loading) {
    return (
      <CustomerLayout>
        <p className="text-center mt-10 text-gray-500">Cargando reserva...</p>
      </CustomerLayout>
    );
  }

  if (!booking) {
    return (
      <CustomerLayout>
        <p className="text-center mt-10 text-red-500">No se pudo cargar la reserva.</p>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Reserva confirmada</h1>
        <p className="text-gray-600 mb-4">Número de reserva: <strong>{booking.reservationNumber}</strong></p>

        <h2 className="font-semibold text-lg mb-2">Detalles</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Cliente:</strong> {booking.customer.name}</p>
          <p><strong>Email:</strong> {booking.customer.email}</p>
          <p><strong>Teléfono:</strong> {booking.customer.phone}</p>
          <p><strong>Check-in:</strong> {booking.check.in_date}</p>
          <p><strong>Check-out:</strong> {booking.check.out_date}</p>
        </div>

        <h2 className="font-semibold text-lg mb-2">Habitaciones</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700">
          {booking.items.map((item: any) => (
            <li key={item.code}>
              {item.name} — ${item.price} x {item.guest} huésped(es)
            </li>
          ))}
        </ul>

        <div className="mt-6 text-right text-teal-700 font-semibold text-lg">
          Total: ${booking.totalAmount}
        </div>
      </div>
    </CustomerLayout>
  );
}
