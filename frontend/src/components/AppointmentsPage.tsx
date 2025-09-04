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
  payment_status?: string;
  notes: string;
  price: number;
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleConfirmAppointment = async (appointmentId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "confirmada" }),
        }
      );

      if (response.ok) {
        // Recargar las citas para mostrar el cambio
        fetchAppointments();
        alert("¡Cita confirmada exitosamente! Ahora puedes proceder al pago.");
      } else {
        alert("Error al confirmar la cita");
      }
    } catch (error) {
      console.error("Error confirmando cita:", error);
      alert("Error de conexión al confirmar la cita");
    }
  };

  const handlePaymentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulación de procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Actualizar el payment_status en el backend
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/appointments/${selectedAppointment?.id}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            payment_status: "paid",
            payment_method: "credit_card",
            payment_amount: selectedAppointment?.price
          }),
        }
      );

      if (response.ok) {
        alert(`¡Pago exitoso! Se han cobrado $${selectedAppointment?.price.toLocaleString()} COP`);
        setShowPaymentModal(false);
        setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", name: "" });
        fetchAppointments(); // Recargar citas
      } else {
        alert("Error al procesar el pago");
      }
    } catch (error) {
      console.error("Error procesando pago:", error);
      alert("Error al procesar el pago");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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
                    {appointment.status === "programada" && (
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                          📅 Cita programada
                        </span>
                        <button
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          className="text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors border border-blue-200"
                        >
                          ✅ Confirmar Cita
                        </button>
                      </div>
                    )}
                    {appointment.status === "confirmada" && (
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          ✅ Cita confirmada - Te contactaremos pronto
                        </span>
                        {(!appointment.payment_status || appointment.payment_status === 'pending') && (
                          <button
                            onClick={() => handlePaymentClick(appointment)}
                            className="text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors border border-emerald-200"
                          >
                            💳 Pagar Cita
                          </button>
                        )}
                        {appointment.payment_status === 'paid' && (
                          <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            💰 Pagado
                          </span>
                        )}
                      </div>
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

        {/* Payment Modal */}
        {showPaymentModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Pago de Cita</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Appointment Summary */}
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Resumen de la Cita</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Servicio:</span> {selectedAppointment.service_name}</p>
                    <p><span className="font-medium">Veterinario:</span> {selectedAppointment.veterinarian_name}</p>
                    <p><span className="font-medium">Mascota:</span> {selectedAppointment.pet_name}</p>
                    <p><span className="font-medium">Fecha:</span> {formatDate(selectedAppointment.appointment_date)}</p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      Total: ${selectedAppointment.price.toLocaleString()} COP
                    </p>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Tarjeta
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({
                        ...paymentData,
                        cardNumber: formatCardNumber(e.target.value)
                      })}
                      maxLength={19}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Vencimiento
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          expiryDate: formatExpiryDate(e.target.value)
                        })}
                        maxLength={5}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({
                          ...paymentData,
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                        })}
                        maxLength={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({
                        ...paymentData,
                        name: e.target.value
                      })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                    </button>
                  </div>
                </form>

                <div className="mt-4 text-xs text-gray-500 text-center">
                  🔒 Simulación de pago seguro - No se procesarán pagos reales
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
