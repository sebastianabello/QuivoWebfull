// src/pages/errors/Unauthorized.tsx
export default function Unauthorized() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600">401 - No autorizado</h1>
      <p className="mt-4 text-lg">No tienes permisos para acceder a esta página.</p>
    </div>
  );
}
