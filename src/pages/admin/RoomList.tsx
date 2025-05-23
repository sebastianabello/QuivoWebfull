import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Room {
  code: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
}

export default function RoomList() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const fetchRooms = async (page = 1) => {
    try {
      const res = await fetch(`http://localhost:8989/inventory/api/rooms?page=${page}`);
      const data = await res.json();
      setRooms(data.data);
      setCurrentPage(data.pageNumber);
      setTotalPages(data.totalPage);
    } catch (error) {
      toast.error("Error al cargar habitaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code: string) => {
    const confirmed = confirm("¿Estás seguro de eliminar esta habitación?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8989/inventory/api/rooms/${code}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Habitación eliminada");
        fetchRooms(currentPage);
      } else {
        toast.error("No se pudo eliminar la habitación");
      }
    } catch (error) {
      toast.error("Error al eliminar habitación");
    }
  };

  useEffect(() => {
    fetchRooms(currentPage);
  }, [currentPage]);

  const filteredRooms = rooms.filter((room) => {
    const matchesName = room.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? room.status === statusFilter : true;
    return matchesName && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Habitaciones</h1>
        <button
          onClick={() => navigate("/admin/rooms/create")}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Nueva habitación
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mt-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-1 border rounded w-full md:w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1 border rounded"
        >
          <option value="">Todos los estados</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="UNAVAILABLE">No disponible</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando habitaciones...</p>
      ) : (
        <>
          <div className="space-y-4">
            {filteredRooms.map((room) => (
              <div
                key={room.code}
                className="border rounded p-4 flex justify-between items-center shadow-sm"
              >
                <div>
                  <h2 className="font-semibold text-lg">{room.name}</h2>
                  <p className="text-sm text-gray-500">{room.description}</p>
                  <p className="text-sm text-gray-700 font-medium">
                    ${room.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Estado: {room.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/rooms/edit/${room.code}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(room.code)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600 flex items-center">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
