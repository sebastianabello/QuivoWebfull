import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomerLayout from "../../layouts/CustomerLayout";

interface BookingDetail {
  reservationNumber: string;
  customer: { name: string; email: string; phone: string };
  checkDate: { in_date: string; out_date: string };
  items: { code: string; name: string; price: number; guest: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function EditBooking() {
  const { reservationNumber } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [inDate, setInDate] = useState("");
  const [outDate, setOutDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await fetch(
          `http://localhost:8989/bookings/api/bookings/${reservationNumber}`
        );
        const data = await res.json();
        setBooking(data);
        setInDate(data.checkDate.in_date);
        setOutDate(data.checkDate.out_date);
      } catch (err) {
        toast.error("Error al cargar la reserva.");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [reservationNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    const inDateObj = new Date(inDate);
    if (inDateObj < today) {
      toast.error("La fecha de entrada no puede ser en el pasado.");
      return;
    }

    if (!booking) return;

    try {
      const res = await fetch(
        `http://localhost:8989/bookings/api/bookings/${reservationNumber}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: booking.items,
            customer: booking.customer,
            checkDate: {
              in_date: inDate,
              out_date: outDate
            }
          })
        }
      );

      if (res.ok) {
        toast.success("Reserva actualizada correctamente.");
        navigate("/bookings");
      } else {
        toast.error("Error al actualizar la reserva.");
      }
    } catch (err) {
      toast.error("Error al conectar con el servidor.");
    }
  };

  if (loading) return <CustomerLayout><p>Cargando...</p></CustomerLayout>;
  if (!booking) return <CustomerLayout><p>No se encontró la reserva.</p></CustomerLayout>;

  return (
    <CustomerLayout>
      <h1 className="text-2xl font-bold mb-6">Editar fechas de la reserva #{booking.reservationNumber}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de entrada</label>
          <input
            type="date"
            value={inDate}
            onChange={(e) => setInDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de salida</label>
          <input
            type="date"
            value={outDate}
            onChange={(e) => setOutDate(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </form>
    </CustomerLayout>
  );
}
