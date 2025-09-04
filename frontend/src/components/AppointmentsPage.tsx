import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Appointment {
  id: number;
  service_name: string;
  veterinarian_name: string;
  veterinarian_specialization: string;
  appointment_date: string;
  pet_name: string;
  pet_species: string;
  status: string;
  notes: string;
  price: number;
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/appointments/my-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        setError("Error al cargar las citas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800",
      confirmada: "bg-blue-100 text-blue-800",
      en_progreso: "bg-orange-100 text-orange-800",
      completada: "bg-green-100 text-green-800",
      cancelada: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status: string) => {
    const texts = {
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      en_progreso: "En Progreso",
      completada: "Completada",
      cancelada: "Cancelada",
    };
    return texts[status as keyof typeof texts] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para ver tus citas
          </p>
          <Link
            to="/login"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mis Citas Veterinarias
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona y revisa todas tus citas agendadas
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando tus citas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Reintentar
            </button>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No tienes citas agendadas
            </h3>
            <p className="text-gray-600 mb-6">
              ¡Agenda tu primera cita para el cuidado de tu mascota!
            </p>
            <Link
              to="/servicios"
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg inline-block"
            >
              Agendar Primera Cita
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {appointment.service_name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {getStatusText(appointment.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="mb-2">
                            <strong>📅 Fecha:</strong>{" "}
                            {formatDate(appointment.appointment_date)}
                          </p>
                          <p className="mb-2">
                            <strong>👨‍⚕️ Veterinario:</strong> Dr.{" "}
                            {appointment.veterinarian_name}
                          </p>
                          <p className="mb-2">
                            <strong>🎓 Especialización:</strong>{" "}
                            {appointment.veterinarian_specialization}
                          </p>
                        </div>
                        <div>
                          <p className="mb-2">
                            <strong>🐾 Mascota:</strong> {appointment.pet_name}
                          </p>
                          <p className="mb-2">
                            <strong>🦮 Especie:</strong>{" "}
                            {appointment.pet_species}
                          </p>
                          <p className="mb-2">
                            <strong>💰 Precio:</strong> $
                            {appointment.price.toLocaleString()} COP
                          </p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <strong>📝 Notas:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons based on status */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {appointment.status === "pendiente" && (
                      <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                        ⏳ Esperando confirmación del veterinario
                      </span>
                    )}
                    {appointment.status === "confirmada" && (
                      <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        ✅ Cita confirmada - Te contactaremos pronto
                      </span>
                    )}
                    {appointment.status === "completada" && (
                      <div className="flex gap-2">
                        <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          ✅ Cita completada
                        </span>
                        <Link
                          to={`/examenes?appointment=${appointment.id}`}
                          className="text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-full transition-colors"
                        >
                          📋 Ver resultados
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ¿Necesitas agendar otra cita?
            </h3>
            <div className="space-x-4">
              <Link
                to="/servicios"
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg inline-block transition-colors duration-200"
              >
                Ver Servicios
              </Link>
              <Link
                to="/mascotas"
                className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-lg inline-block transition-colors duration-200"
              >
                Gestionar Mascotas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
