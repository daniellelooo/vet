import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-400 to-amber-400 rounded-3xl mb-6 shadow-lg hover:scale-105 transition-transform duration-300">
                <span className="text-5xl">🏠</span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-800 leading-tight">
              Veterinaria
              <span className="block bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                a Domicilio
              </span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Cuidado profesional y cariñoso para tus mascotas en la comodidad
              de tu hogar. Veterinarios certificados disponibles cuando los
              necesites.
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/servicios"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  Agendar Cita 🗓️
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
                <Link
                  to="/mascotas"
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  Mis Mascotas 🐕
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  Crear Cuenta Gratis ✨
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl border-2 border-orange-500 hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                >
                  Iniciar Sesión 🔑
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              ¿Por qué elegir
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {" "}
                VetCare
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Combinamos profesionalismo, comodidad y cuidado personalizado para
              ofrecer la mejor experiencia para ti y tu mascota
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 text-center h-full border border-orange-100 hover:shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Comodidad Total
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Sin estrés ni traslados. Atendemos a tu mascota en la
                  seguridad y tranquilidad de su hogar
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 text-center h-full border border-amber-100 hover:shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">⏰</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Siempre Disponibles
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Emergencias 24/7. Citas programadas cuando más te convenga. Tu
                  mascota es nuestra prioridad
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 text-center h-full border border-yellow-100 hover:shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">👨‍⚕️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Expertos Certificados
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Veterinarios con años de experiencia, equipamiento profesional
                  y amor genuino por los animales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Nuestros
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Servicios
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cuidado integral para tu mascota con la más alta calidad y
              profesionalismo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-orange-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🩺</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Consulta General
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Examen físico completo y diagnóstico básico en tu hogar
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    $45.000
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    45 min
                  </span>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-amber-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">💉</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Vacunación
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Aplicación de vacunas según el esquema recomendado
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    $30.000
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    30 min
                  </span>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-yellow-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🔬</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Exámenes de Sangre
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Análisis completo con hemograma y química sanguínea
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    $80.000
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    40 min
                  </span>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-orange-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⚕️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Cirugías Menores
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Procedimientos ambulatorios como esterilización y suturas
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    $150.000
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    90 min
                  </span>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-amber-100 h-full">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Emergencias
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Atención urgente disponible 24 horas del día
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    $65.000
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    60 min
                  </span>
                </div>
              </div>
            </div>

            <div className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-white flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">
                    ¿Necesitas algo más?
                  </h3>
                  <p className="mb-6 opacity-90 leading-relaxed">
                    Consulta nuestros servicios adicionales y planes
                    personalizados
                  </p>
                  <Link
                    to="/servicios"
                    className="bg-white text-orange-600 px-6 py-3 rounded-2xl font-semibold hover:bg-orange-50 transition-all duration-300 inline-flex items-center group"
                  >
                    Ver Todos
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¡Tu mascota merece el mejor cuidado!
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Únete a miles de familias que ya confían en VetCare para el
            bienestar de sus compañeros peludos
          </p>

          {user ? (
            <Link
              to="/servicios"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Agendar Cita Ahora
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              Registrarse Gratis
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
