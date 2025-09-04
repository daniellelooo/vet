import React, { useState, useEffect } from "react";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category: string;
  requirements: string;
}

interface Veterinarian {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  phone: string;
  email: string;
  years_experience: number;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
}

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [appointmentData, setAppointmentData] = useState({
    pet_id: "",
    veterinarian_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchVeterinarians();
    fetchPets();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchVeterinarians = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/veterinarians");
      const data = await response.json();
      setVeterinarians(data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
    }
  };

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/appointments/pets",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "Consulta":
        return "🩺";
      case "Prevención":
        return "🛡️";
      case "Cirugía":
        return "✂️";
      case "Emergencia":
        return "🚨";
      case "Diagnóstico":
        return "🔬";
      case "Cuidados Paliativos":
        return "🌙";
      default:
        return "❤️";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Consulta":
        return "from-blue-500 to-blue-600";
      case "Prevención":
        return "from-green-500 to-green-600";
      case "Cirugía":
        return "from-red-500 to-red-600";
      case "Emergencia":
        return "from-orange-500 to-orange-600";
      case "Diagnóstico":
        return "from-purple-500 to-purple-600";
      case "Cuidados Paliativos":
        return "from-gray-500 to-gray-600";
      default:
        return "from-orange-500 to-amber-500";
    }
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...appointmentData,
          service_id: selectedService?.id,
        }),
      });

      if (response.ok) {
        setMessage("¡Cita agendada exitosamente! 🎉");
        setShowBookingModal(false);
        setAppointmentData({
          pet_id: "",
          veterinarian_id: "",
          appointment_date: "",
          appointment_time: "",
          notes: "",
        });
        setTimeout(() => setMessage(""), 5000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setMessage("Error al agendar la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-12 mb-12 text-white shadow-2xl">
          <div className="max-w-4xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Servicios Veterinarios a Domicilio
            </h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Cuidado profesional para tu mascota en la comodidad de tu hogar.
              Nuestros veterinarios certificados ofrecen atención de calidad sin
              el estrés del transporte.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div
            className={`mb-8 p-6 rounded-2xl shadow-lg ${
              message.includes("Error")
                ? "bg-red-50 border-2 border-red-200 text-red-700"
                : "bg-green-50 border-2 border-green-200 text-green-700"
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {message.includes("Error") ? "❌" : "✅"}
              </span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl border border-orange-100 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
            >
              <div className="p-8">
                {/* Service Header */}
                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${getCategoryColor(
                      service.category
                    )} text-white text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getServiceIcon(service.category)}
                  </div>
                  <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200">
                    {service.category}
                  </span>
                </div>

                {/* Service Info */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">
                  {service.description}
                </p>

                {/* Service Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center bg-green-50 rounded-xl p-3 border border-green-200">
                    <span className="text-2xl mr-3">💰</span>
                    <span className="font-bold text-green-600 text-2xl">
                      ${service.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <span className="text-2xl mr-3">⏱️</span>
                    <span className="font-medium text-blue-700">
                      {service.duration_minutes} minutos
                    </span>
                  </div>

                  {service.requirements && (
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
                      <p className="text-sm text-amber-800 font-medium">
                        <span className="text-lg mr-2">📋</span>
                        <strong>Requisitos:</strong> {service.requirements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBookService(service)}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 group flex items-center justify-center"
                >
                  <span className="text-xl mr-2">📅</span>
                  Agendar Cita
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">
                    →
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              📅 Agendar: {selectedService.name}
            </h2>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Pet Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🐕 Selecciona tu mascota
                </label>
                <select
                  required
                  value={appointmentData.pet_id}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      pet_id: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Elige una mascota</option>
                  {pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species} - {pet.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Veterinarian Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👨‍⚕️ Selecciona veterinario
                </label>
                <select
                  required
                  value={appointmentData.veterinarian_id}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      veterinarian_id: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Elige un veterinario</option>
                  {veterinarians.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      {vet.first_name} {vet.last_name} - {vet.specialization}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={appointmentData.appointment_date}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        appointment_date: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 Hora
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentData.appointment_time}
                    onChange={(e) =>
                      setAppointmentData({
                        ...appointmentData,
                        appointment_time: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Notas adicionales
                </label>
                <textarea
                  value={appointmentData.notes}
                  onChange={(e) =>
                    setAppointmentData({
                      ...appointmentData,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe síntomas o información adicional..."
                />
              </div>

              {/* Service Summary */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <h4 className="font-medium text-orange-800 mb-2">
                  💰 Resumen del servicio:
                </h4>
                <p className="text-orange-700">
                  <strong>{selectedService.name}</strong> - $
                  {selectedService.price.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Duración estimada: {selectedService.duration_minutes} minutos
                </p>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? "⏳ Agendando..." : "✅ Confirmar Cita"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🌟 ¿Por qué elegir nuestros servicios a domicilio?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🏠</div>
            <h3 className="font-bold text-gray-800 mb-2">Comodidad</h3>
            <p className="text-gray-600">
              Tu mascota se siente más tranquila en su entorno familiar
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">⏰</div>
            <h3 className="font-bold text-gray-800 mb-2">Conveniencia</h3>
            <p className="text-gray-600">
              Sin traslados ni esperas. Atención puntual a tu domicilio
            </p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-3">👩‍⚕️</div>
            <h3 className="font-bold text-gray-800 mb-2">Profesionalismo</h3>
            <p className="text-gray-600">
              Veterinarios certificados con años de experiencia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
