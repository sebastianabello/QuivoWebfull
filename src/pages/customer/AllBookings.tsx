import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";

interface BookingSummary {
  reservationNumber: string;
  status: string;
}

interface BookingDetail {
  reservationNumber: string;
  customer: { name: string };
  check: { in_date: string; out_date: string };
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AllBookings() {
  const [reservations, setReservations] = useState<BookingDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await fetch("http://localhost:8989/bookings/api/bookings");
        const summaryList: BookingSummary[] = await res.json();

        const detailedBookings: BookingDetail[] = [];

        for (const summary of summaryList) {
          try {
            const detailRes = await fetch(
              `http://localhost:8989/bookings/api/bookings/${summary.reservationNumber}`
            );
            const detail = await detailRes.json();
            detailedBookings.push(detail);
          } catch (err) {
            console.warn("No se pudo cargar reserva:", summary.reservationNumber);
          }
        }

        setReservations(detailedBookings);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  return (
    <CustomerLayout>
      <h1 className="text-2xl font-bold mb-6">Todas las reservas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">No hay reservas registradas.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((booking) => (
            <div
              key={booking.reservationNumber}
              className="border-gray-400 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-teal-700">
                  Reserva #{booking.reservationNumber.slice(0, 8)}...
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Cliente:</strong> {booking.customer.name}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Fechas:</strong> {booking.check.in_date} – {booking.check.out_date}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Total:</strong> ${booking.totalAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Estado:</strong> {booking.status}
              </p>

              <button
                onClick={() => navigate(`/booking/${booking.reservationNumber}`)}
                className="px-4 py-1 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition"
              >
                Ver detalle
              </button>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
