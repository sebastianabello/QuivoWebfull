import React, { useState, useRef, useEffect } from "react";
import { Room } from "../types/Room";
import { DateRange } from "react-date-range";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import toast from "react-hot-toast";
import { useKeycloak } from "@react-keycloak/web";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface Props {
  room: Room;
}

export default function BookingBox({ room }: Props) {
  const { keycloak } = useKeycloak();
  const isAuthenticated = keycloak.authenticated;

  const [guest, setGuest] = useState(1);
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: 'selection',
      color: '#0f766e',
    },
  ]);

  useEffect(() => {
    if (isAuthenticated && keycloak.tokenParsed) {
      setCustomer((prev) => ({
        ...prev,
        name: keycloak.tokenParsed?.name || "",
        email: keycloak.tokenParsed?.email || "",
      }));
    }
  }, [isAuthenticated, keycloak.tokenParsed]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !(calendarRef.current as any).contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateFields = () => {
    const newErrors = { name: "", email: "", phone: "" };
    let valid = true;

    if (!customer.name.trim()) {
      newErrors.name = "Nombre requerido";
      valid = false;
    }
    if (!customer.email.trim()) {
      newErrors.email = "Correo requerido";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Correo inválido";
      valid = false;
    }
    if (!customer.phone.trim()) {
      newErrors.phone = "Teléfono requerido";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleBooking = async () => {
    if (!isAuthenticated) return keycloak.login();

    const start = range[0].startDate;
    const end = range[0].endDate;
    const inDate = start?.toISOString().split('T')[0];
    const outDate = end?.toISOString().split('T')[0];

    if (!start || !end || !inDate || !outDate) return toast.error("Seleccione un rango de fechas válido");

    const nights = differenceInCalendarDays(end, start);
    if (nights < 1) return toast.error("Debe seleccionar al menos una noche");

    if (!validateFields()) return toast.error("Por favor corrija los errores en el formulario");

    setLoading(true);
    const toastId = toast.loading("Enviando reserva...");
    try {
      const payload = {
        items: [{ code: room.code, name: room.name, price: room.price, guest }],
        customer,
        checkDate: { in_date: inDate, out_date: outDate },
      };

      const res = await fetch(`http://localhost:8989/bookings/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("¡Reserva realizada con éxito!", { id: toastId });
      } else {
        toast.error("Error al reservar", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        ${room.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">por noche</span>
      </h2>

      {!isAuthenticated && (
        <div className="text-sm text-red-600 mb-4">
          Debes iniciar sesión para completar la reserva.
        </div>
      )}

      <div className="mb-4 relative" ref={calendarRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fechas</label>
        <button
          onClick={() => isAuthenticated && setShowCalendar(!showCalendar)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-left bg-white disabled:bg-gray-100"
          disabled={!isAuthenticated}
        >
          {format(range[0].startDate!, 'dd/MM/yyyy')} - {format(range[0].endDate!, 'dd/MM/yyyy')}
        </button>

        {showCalendar && (
          <div className="absolute z-50 mt-2 shadow border rounded">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                setRange([item.selection]);
                if (
                  item.selection.startDate &&
                  item.selection.endDate &&
                  item.selection.startDate !== item.selection.endDate
                ) {
                  setShowCalendar(false);
                }
              }}
              moveRangeOnFirstSelection={false}
              ranges={range}
              rangeColors={["#0f766e"]}
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Huéspedes</label>
        <select
          value={guest}
          onChange={(e) => setGuest(Number(e.target.value))}
          disabled={!isAuthenticated}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        >
          {[1, 2, 3, 4, 5].map((g) => (
            <option key={g} value={g}>
              {g} huésped{g > 1 ? "es" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="text-sm font-medium text-gray-700 block mb-1">Nombre</label>
        <input
          type="text"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          disabled={!isAuthenticated}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="mb-2">
        <label className="text-sm font-medium text-gray-700 block mb-1">Correo electrónico</label>
        <input
          type="email"
          value={customer.email}
          disabled
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100"
        />
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 block mb-1">Teléfono</label>
        <input
          type="tel"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          disabled={!isAuthenticated}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>

      <button
        onClick={handleBooking}
        disabled={loading}
        className="w-full bg-gradient-to-r bg-teal-700 hover:bg-teal-600 text-white font-semibold py-2 rounded text-sm"
      >
        {loading ? "Reservando..." : "Reservar"}
      </button>
    </div>
  );
}
