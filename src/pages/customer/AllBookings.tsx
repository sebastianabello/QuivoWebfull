import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import Breadcrumbs from "../../components/Breadcrumbs";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    return date < today;
  };

  const isWithinThreeDays = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays < 3;
  };

  const confirmCancel = (reservationNumber: string, onConfirm: (reason: string) => void) => {
    let reason = "";

    toast.custom((t) => (
      <div className="bg-white p-4 shadow-md rounded-lg border border-gray-200 w-96">
        <h2 className="text-lg font-semibold mb-2">¿Cancelar reserva?</h2>
        <p className="text-sm text-gray-600 mb-2">
          Por favor, indique el motivo de la cancelación.
        </p>
        <textarea
          className="w-full border rounded px-2 py-1 text-sm mb-4"
          rows={3}
          placeholder="Motivo de cancelación..."
          onChange={(e) => (reason = e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              if (!reason.trim()) {
                toast.error("Debe escribir un motivo.");
                return;
              }
              toast.dismiss(t.id);
              onConfirm(reason);
            }}
            className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    ));
  };

  const handleCancel = (reservationNumber: string) => {
    confirmCancel(reservationNumber, async (reason: string) => {
      try {
        const res = await fetch(
          `http://localhost:8989/bookings/api/bookings/${reservationNumber}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ reason })
          }
        );
        if (res.ok) {
          setReservations((prev) =>
            prev.filter((r) => r.reservationNumber !== reservationNumber)
          );
          toast.success("Reserva cancelada exitosamente.");
        } else {
          toast.error("No se pudo cancelar la reserva.");
        }
      } catch (error) {
        toast.error("Error al cancelar la reserva.");
      }
    });
  };


  const handleEdit = (booking: BookingDetail) => {
    const past = isPastDate(booking.check.in_date);

    if (past) {
      toast.error("No se puede editar una reserva ya vencida.");
      return;
    }

    navigate(`/booking/edit/${booking.reservationNumber}`);
  };

  return (
    <CustomerLayout>
      <Breadcrumbs
        paths={[
          { name: t("home"), translationKey: "home", href: "/" },
          { name: t("bookings"), translationKey: "bookings", href: "/bookings" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Todas las reservas</h1>

      {loading ? (
        <p className="text-gray-500">Cargando reservas...</p>
      ) : reservations.length === 0 ? (
        <p className="text-gray-500">No hay reservas registradas.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((booking) => {
            const past = isPastDate(booking.check.in_date);
            const near = isWithinThreeDays(booking.check.in_date);

            return (
              <div
                key={booking.reservationNumber}
                className="border-gray-400 rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-teal-700">
                    Reserva #{booking.reservationNumber.slice(0, 8)}...
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

                <div className="flex justify-between items-center mt-2">
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                    >
                      Editar
                    </button>

                    {!past && !near && (
                      <button
                        onClick={() => handleCancel(booking.reservationNumber)}
                        className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                      >
                        Cancelar
                      </button>
                    )}

                    {!past && near && (
                      <span className="text-xs text-red-500">
                        No se puede cancelar, faltan menos de 3 días.
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/booking/${booking.reservationNumber}`)}
                    className="px-4 py-1 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CustomerLayout>
  );
}
