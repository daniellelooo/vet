/**
 * COMPONENTE LOGIN - VISTA EN PATRÓN MVC
 * ======================================
 * Este componente React implementa la Vista en el patrón MVC para la autenticación.
 *
 * Responsabilidades:
 * - Presentar la interfaz de usuario para el login
 * - Capturar datos de entrada del usuario
 * - Comunicarse con el backend (Controlador) a través de la función login()
 * - Mostrar errores y estados de carga
 * - Navegar a otras vistas según el resultado
 *
 * Comunicación Frontend-Backend:
 * - Frontend (puerto 5173) → Backend (puerto 3000)
 * - HTTP POST a /api/auth/login
 * - Recibe JWT token para mantener sesión
 */

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  // Estados locales para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hook personalizado para autenticación
  const { login } = useAuth();
  const navigate = useNavigate();

  // Manejador del formulario - Envía datos al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Llamada al backend (Controlador) a través del hook useAuth
      const success = await login(email, password);
      if (success) {
        navigate("/"); // Redirigir al home en caso de éxito
      } else {
        setError("Email o contraseña incorrectos");
      }
    } catch {
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">🐾</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{" "}
            <Link
              to="/register"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              crea una cuenta nueva
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tu contraseña"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </button>
            </div>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            🎯 Credenciales de demostración:
          </h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>
              <strong>Email:</strong> maria@demo.com
            </p>
            <p>
              <strong>Contraseña:</strong> demo123
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail("maria@demo.com");
              setPassword("demo123");
            }}
            className="mt-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded transition-colors duration-200"
          >
            Usar credenciales demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
