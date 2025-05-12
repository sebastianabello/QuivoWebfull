import { Link } from "react-router-dom"

export default function Error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl mt-4">Página no encontrada</p>
      <p className="text-gray-600 mt-2">Lo sentimos, la página que buscas no existe.</p>
      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
