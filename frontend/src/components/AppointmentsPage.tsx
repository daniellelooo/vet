// Importaciones necesarias para el componente
import React, { useState, useEffect } from "react"; // React hooks para estado y efectos
import { useAuth } from "../hooks/useAuth"; // Hook personalizado para autenticación
import { Link } from "react-router-dom"; // Componente para navegación entre rutas

// Interface que define la estructura de una cita veterinaria
interface Appointment {
  id: number; // Identificador único de la cita
  service_name: string; // Nombre del servicio veterinario
  veterinarian_name: string; // Nombre del veterinario asignado
  veterinarian_specialization: string; // Especialización del veterinario
  appointment_date: string; // Fecha y hora de la cita
  pet_name: string; // Nombre de la mascota
  pet_species: string; // Especie de la mascota (perro, gato, etc.)
  status: string; // Estado de la cita (pendiente, confirmada, completada, cancelada)
  payment_status?: string; // Estado del pago (opcional)
  notes: string; // Notas adicionales de la cita
  price: number; // Precio del servicio en COP
}

// Componente principal para gestión de citas veterinarias
const AppointmentsPage: React.FC = () => {
  // Estados para manejo de datos y UI
  const [appointments, setAppointments] = useState<Appointment[]>([]); // Lista de citas del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(""); // Mensajes de error
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Control del modal de pago
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null); // Cita seleccionada para pago

  // Estados para formulario de pago con tarjeta
  const [paymentData, setPaymentData] = useState({
    cardNumber: "", // Número de tarjeta formateado (XXXX XXXX XXXX XXXX)
    expiryDate: "", // Fecha de vencimiento (MM/AA)
    cvv: "", // Código de seguridad
    name: "", // Nombre del titular
  });

  // Estado para selección del método de pago
  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "cash">(
    "credit_card"
  );

  // Estados para formulario de pago en efectivo
  const [cashPaymentData, setCashPaymentData] = useState({
    receivedAmount: "", // Monto que recibirá el veterinario
    notes: "", // Notas adicionales para el pago en efectivo
  });

  const [isProcessing, setIsProcessing] = useState(false); // Estado del procesamiento de pago
  const { user } = useAuth(); // Usuario autenticado desde el contexto

  // Efecto para cargar citas cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  // Función para obtener las citas del usuario desde el backend
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtener token JWT del almacenamiento local
      // Llamada HTTP GET al endpoint de citas del usuario autenticado
      const response = await fetch(
        "http://localhost:3000/api/appointments/my-appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir token JWT para autenticación
          },
        }
      );

      if (response.ok) {
        const data = await response.json(); // Parsear respuesta JSON
        setAppointments(data); // Actualizar estado con las citas obtenidas
      } else {
        setError("Error al cargar las citas"); // Manejar errores HTTP
      }
    } catch {
      setError("Error de conexión"); // Manejar errores de red
    } finally {
      setLoading(false); // Finalizar estado de carga
    }
  };

  // Función que retorna clases CSS según el estado de la cita
  const getStatusColor = (status: string) => {
    const colors = {
      pendiente: "bg-yellow-100 text-yellow-800", // Amarillo para pendientes
      confirmada: "bg-blue-100 text-blue-800", // Azul para confirmadas
      en_progreso: "bg-orange-100 text-orange-800", // Naranja para en progreso
      completada: "bg-green-100 text-green-800", // Verde para completadas
      cancelada: "bg-red-100 text-red-800", // Rojo para canceladas
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"; // Color por defecto
  };

  // Función que convierte el estado de la cita a texto legible
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
    setPaymentMethod("credit_card");
    setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", name: "" });
    setCashPaymentData({ receivedAmount: "", notes: "" });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validaciones específicas por método de pago
      if (paymentMethod === "credit_card") {
        if (
          !paymentData.cardNumber ||
          !paymentData.expiryDate ||
          !paymentData.cvv ||
          !paymentData.name
        ) {
          alert("Por favor, completa todos los campos de la tarjeta");
          setIsProcessing(false);
          return;
        }
      } else if (paymentMethod === "cash") {
        const receivedAmount = parseFloat(cashPaymentData.receivedAmount);
        if (
          !receivedAmount ||
          receivedAmount < (selectedAppointment?.price || 0)
        ) {
          alert(
            `El monto recibido debe ser al menos $${selectedAppointment?.price?.toLocaleString()} COP`
          );
          setIsProcessing(false);
          return;
        }
      }

      // Simulación de procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
            payment_method: paymentMethod,
            payment_amount: selectedAppointment?.price,
            ...(paymentMethod === "cash" && {
              cash_received: parseFloat(cashPaymentData.receivedAmount),
              cash_change:
                parseFloat(cashPaymentData.receivedAmount) -
                (selectedAppointment?.price || 0),
              payment_notes: cashPaymentData.notes,
            }),
          }),
        }
      );

      if (response.ok) {
        if (paymentMethod === "credit_card") {
          alert(
            `¡Pago con tarjeta exitoso! Se han cobrado $${selectedAppointment?.price.toLocaleString()} COP`
          );
        } else {
          const change =
            parseFloat(cashPaymentData.receivedAmount) -
            (selectedAppointment?.price || 0);
          alert(
            `¡Pago en efectivo exitoso!\nTotal: $${selectedAppointment?.price.toLocaleString()} COP\nRecibido: $${parseFloat(
              cashPaymentData.receivedAmount
            ).toLocaleString()} COP\nCambio: $${change.toLocaleString()} COP`
          );
        }
        setShowPaymentModal(false);
        setPaymentData({ cardNumber: "", expiryDate: "", cvv: "", name: "" });
        setCashPaymentData({ receivedAmount: "", notes: "" });
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
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
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
                          onClick={() =>
                            handleConfirmAppointment(appointment.id)
                          }
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
                        {(!appointment.payment_status ||
                          appointment.payment_status === "pending") && (
                          <button
                            onClick={() => handlePaymentClick(appointment)}
                            className="text-sm text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors border border-emerald-200"
                          >
                            💳 Pagar Cita
                          </button>
                        )}
                        {appointment.payment_status === "paid" && (
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
                  <h3 className="text-xl font-bold text-gray-900">
                    Pago de Cita
                  </h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Appointment Summary */}
                <div className="bg-orange-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Resumen de la Cita
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Servicio:</span>{" "}
                      {selectedAppointment.service_name}
                    </p>
                    <p>
                      <span className="font-medium">Veterinario:</span>{" "}
                      {selectedAppointment.veterinarian_name}
                    </p>
                    <p>
                      <span className="font-medium">Mascota:</span>{" "}
                      {selectedAppointment.pet_name}
                    </p>
                    <p>
                      <span className="font-medium">Fecha:</span>{" "}
                      {formatDate(selectedAppointment.appointment_date)}
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      Total: ${selectedAppointment.price.toLocaleString()} COP
                    </p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Método de Pago
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        paymentMethod === "credit_card"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <div className="font-medium">Tarjeta de Crédito</div>
                        <div className="text-xs text-gray-500">
                          Pago con tarjeta
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        paymentMethod === "cash"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💵</div>
                        <div className="font-medium">Efectivo</div>
                        <div className="text-xs text-gray-500">
                          Pago en efectivo
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {paymentMethod === "credit_card" ? (
                    <>
                      {/* Credit Card Form */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número de Tarjeta
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              cardNumber: formatCardNumber(e.target.value),
                            })
                          }
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
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                expiryDate: formatExpiryDate(e.target.value),
                              })
                            }
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
                            onChange={(e) =>
                              setPaymentData({
                                ...paymentData,
                                cvv: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4),
                              })
                            }
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
                          onChange={(e) =>
                            setPaymentData({
                              ...paymentData,
                              name: e.target.value,
                            })
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Cash Payment Form */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center">
                          <div className="text-green-600 text-xl mr-3">💵</div>
                          <div>
                            <h5 className="font-medium text-green-800">
                              Pago en Efectivo
                            </h5>
                            <p className="text-sm text-green-600">
                              El veterinario recibirá el pago al momento de la
                              consulta
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Monto que recibirá el veterinario *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            value={cashPaymentData.receivedAmount}
                            onChange={(e) =>
                              setCashPaymentData({
                                ...cashPaymentData,
                                receivedAmount: e.target.value,
                              })
                            }
                            min={selectedAppointment.price}
                            required
                            className="w-full pl-8 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">
                            COP
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Mínimo: ${selectedAppointment.price.toLocaleString()}{" "}
                          COP
                        </p>
                        {cashPaymentData.receivedAmount &&
                          parseFloat(cashPaymentData.receivedAmount) >
                            selectedAppointment.price && (
                            <p className="text-sm text-green-600 mt-1">
                              Cambio: $
                              {(
                                parseFloat(cashPaymentData.receivedAmount) -
                                selectedAppointment.price
                              ).toLocaleString()}{" "}
                              COP
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notas adicionales (opcional)
                        </label>
                        <textarea
                          placeholder="Ej: Billetes de denominación específica, instrucciones especiales..."
                          value={cashPaymentData.notes}
                          onChange={(e) =>
                            setCashPaymentData({
                              ...cashPaymentData,
                              notes: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex">
                          <div className="text-amber-600 text-lg mr-2">ℹ️</div>
                          <div className="text-sm text-amber-700">
                            <p className="font-medium mb-1">
                              Información importante:
                            </p>
                            <ul className="text-xs space-y-1">
                              <li>
                                • El pago se realizará directamente al
                                veterinario
                              </li>
                              <li>
                                • Asegúrate de tener el monto exacto o superior
                              </li>
                              <li>
                                • El veterinario confirmará el pago al finalizar
                                el servicio
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Procesando...
                        </span>
                      ) : paymentMethod === "credit_card" ? (
                        "Pagar con Tarjeta"
                      ) : (
                        "Confirmar Pago en Efectivo"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
