import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

interface RoomFormData {
  code: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  status: string;
}

export default function RoomForm() {
  const { code } = useParams();
  const isEditing = Boolean(code);
  const navigate = useNavigate();

  const [form, setForm] = useState<RoomFormData>({
    code: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "price" ? parseFloat(value) : value }));
  };

  const fetchRoom = async () => {
    try {
      const res = await fetch(`http://localhost:8989/inventory/api/rooms/${code}`);
      const data = await res.json();
      setForm(data);
    } catch (err) {
      toast.error("Error al cargar la habitación");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing
        ? `http://localhost:8989/inventory/api/rooms/${code}`
        : "http://localhost:8989/inventory/api/rooms";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(`Habitación ${isEditing ? "actualizada" : "creada"} correctamente`);
        navigate("/admin/rooms");
      } else {
        toast.error("Error al guardar la habitación");
      }
    } catch (err) {
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditing) fetchRoom();
  }, [code]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? "Editar habitación" : "Nueva habitación"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isEditing && (
          <div>
            <label className="block mb-1 font-medium">Código</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Precio</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">URL de imagen</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Estado</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="AVAILABLE">Disponible</option>
            <option value="UNAVAILABLE">No disponible</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}
