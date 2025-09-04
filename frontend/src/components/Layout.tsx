import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🐾</span>
              </div>
              <span className="text-xl font-semibold text-orange-800">
                VetCare
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-orange-700 bg-orange-100"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/servicios"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive("/servicios")
                    ? "text-orange-700 bg-orange-100"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                Servicios
              </Link>
              {user && (
                <>
                  <Link
                    to="/citas"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/citas")
                        ? "text-orange-700 bg-orange-100"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Mis Citas
                  </Link>
                  <Link
                    to="/mascotas"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/mascotas")
                        ? "text-orange-700 bg-orange-100"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Mascotas
                  </Link>
                  <Link
                    to="/examenes"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive("/examenes")
                        ? "text-orange-700 bg-orange-100"
                        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    Exámenes
                  </Link>
                </>
              )}
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Hola, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link
                    to="/login"
                    className="text-orange-600 hover:text-orange-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-orange-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">VetCare</h3>
              <p className="text-orange-200 text-sm">
                Cuidado veterinario profesional en la comodidad de tu hogar.
                Nuestros veterinarios certificados brindan atención de calidad
                con un enfoque cálido y personal.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="text-orange-200 text-sm space-y-2">
                <p>📞 Línea de atención: +57 300 123 4567</p>
                <p>📧 Email: info@vetcare.com</p>
                <p>🕒 Disponible 24/7 para emergencias</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <div className="text-orange-200 text-sm space-y-1">
                <p>• Consultas a domicilio</p>
                <p>• Vacunación</p>
                <p>• Exámenes de laboratorio</p>
                <p>• Cirugías menores</p>
                <p>• Atención de emergencias</p>
              </div>
            </div>
          </div>
          <div className="border-t border-orange-700 mt-8 pt-8 text-center text-orange-200 text-sm">
            <p>
              &copy; 2025 VetCare. Todos los derechos reservados. Cuidando a tus
              mascotas con amor.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
