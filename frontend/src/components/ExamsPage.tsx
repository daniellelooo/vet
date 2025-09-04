import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useSearchParams } from "react-router-dom";

interface ExamType {
  id: number;
  name: string;
  description: string;
  price: number;
  preparation_instructions: string;
  category: string;
}

interface ExamResult {
  id: number;
  exam_name: string;
  appointment_date: string;
  pet_name: string;
  results: string;
  status: string;
  exam_date: string;
  veterinarian_name: string;
}

const ExamsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"request" | "results">("request");
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Form data for exam request
  const [requestData, setRequestData] = useState({
    pet_name: "",
    pet_species: "",
    preferred_date: "",
    preferred_time: "",
    notes: "",
  });

  useEffect(() => {
    // Check if we should show results tab (coming from appointments)
    const appointmentId = searchParams.get("appointment");
    if (appointmentId) {
      setActiveTab("results");
    }

    fetchExamTypes();
    if (user) {
      fetchExamResults();
    }
  }, [user, searchParams]);

  const fetchExamTypes = async () => {
    try {
      // Mock exam types (these could come from your services API)
      const mockExamTypes: ExamType[] = [
        {
          id: 1,
          name: "Hemograma Completo",
          description:
            "Análisis completo de células sanguíneas, detecta anemia, infecciones y otros trastornos.",
          price: 45000,
          preparation_instructions: "Ayuno de 8-12 horas antes del examen",
          category: "Hematología",
        },
        {
          id: 2,
          name: "Química Sanguínea",
          description:
            "Evaluación de función renal, hepática y metabólica general.",
          price: 60000,
          preparation_instructions:
            "Ayuno de 12 horas, evitar ejercicio intenso 24h antes",
          category: "Bioquímica",
        },
        {
          id: 3,
          name: "Perfil Hepático",
          description:
            "Análisis específico para evaluar la función del hígado.",
          price: 55000,
          preparation_instructions:
            "Ayuno de 12 horas, suspender medicamentos 24h antes (consultar)",
          category: "Bioquímica",
        },
        {
          id: 4,
          name: "Coproscópico",
          description:
            "Análisis de heces para detectar parásitos, bacterias y sangre oculta.",
          price: 25000,
          preparation_instructions: "Muestra fresca de heces del mismo día",
          category: "Parasitología",
        },
        {
          id: 5,
          name: "Urianálisis",
          description:
            "Análisis completo de orina para evaluar función renal y detectar infecciones.",
          price: 30000,
          preparation_instructions:
            "Primera orina de la mañana, muestra estéril",
          category: "Urología",
        },
      ];
      setExamTypes(mockExamTypes);
    } catch (error) {
      console.error("Error loading exam types:", error);
    }
  };

  const fetchExamResults = async () => {
    try {
      // Mock exam results (these would come from your API)
      const mockResults: ExamResult[] = [
        {
          id: 1,
          exam_name: "Hemograma Completo",
          appointment_date: "2025-08-15T10:00:00",
          pet_name: "Luna",
          results: `HEMOGRAMA COMPLETO - RESULTADOS:

SERIE ROJA:
• Eritrocitos: 6.2 M/µL (Referencia: 5.5-8.5) ✓ Normal
• Hemoglobina: 14.5 g/dL (Referencia: 12-18) ✓ Normal  
• Hematocrito: 42% (Referencia: 37-55) ✓ Normal

SERIE BLANCA:
• Leucocitos: 8,500/µL (Referencia: 6,000-17,000) ✓ Normal
• Neutrófilos: 70% ✓ Normal
• Linfocitos: 25% ✓ Normal
• Monocitos: 4% ✓ Normal
• Eosinófilos: 1% ✓ Normal

PLAQUETAS:
• Recuento: 285,000/µL (Referencia: 200,000-500,000) ✓ Normal

INTERPRETACIÓN:
Hemograma dentro de parámetros normales. No se observan signos de anemia, infección o alteraciones hematológicas significativas.`,
          status: "completado",
          exam_date: "2025-08-15T10:30:00",
          veterinarian_name: "Dr. Carlos Mendoza",
        },
        {
          id: 2,
          exam_name: "Química Sanguínea",
          appointment_date: "2025-08-10T14:00:00",
          pet_name: "Max",
          results: `QUÍMICA SANGUÍNEA - RESULTADOS:

FUNCIÓN RENAL:
• Creatinina: 1.2 mg/dL (Referencia: 0.5-1.8) ✓ Normal
• BUN: 18 mg/dL (Referencia: 7-27) ✓ Normal
• Relación BUN/Creatinina: 15 ✓ Normal

FUNCIÓN HEPÁTICA:
• ALT: 35 U/L (Referencia: 10-125) ✓ Normal
• AST: 28 U/L (Referencia: 0-50) ✓ Normal
• Fosfatasa Alcalina: 45 U/L (Referencia: 20-156) ✓ Normal

METABOLISMO:
• Glucosa: 95 mg/dL (Referencia: 70-143) ✓ Normal
• Colesterol: 180 mg/dL (Referencia: 112-328) ✓ Normal
• Proteínas Totales: 6.8 g/dL (Referencia: 5.2-8.2) ✓ Normal

INTERPRETACIÓN:
Perfil bioquímico normal. Función renal y hepática adecuadas. Metabolismo equilibrado.`,
          status: "completado",
          exam_date: "2025-08-10T14:30:00",
          veterinarian_name: "Dra. Ana García",
        },
      ];
      setExamResults(mockResults);
    } catch (error) {
      console.error("Error loading exam results:", error);
    }
  };

  const handleRequestExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam) return;

    setLoading(true);
    setMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage(
        "¡Solicitud de examen enviada exitosamente! Te contactaremos para coordinar la toma de muestras."
      );

      // Reset form
      setSelectedExam(null);
      setRequestData({
        pet_name: "",
        pet_species: "",
        preferred_date: "",
        preferred_time: "",
        notes: "",
      });
    } catch {
      setMessage("Error al enviar la solicitud. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
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
            Debes iniciar sesión para acceder a los exámenes
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
            Exámenes Veterinarios
          </h1>
          <p className="text-lg text-gray-600">
            Solicita exámenes para tu mascota y consulta resultados
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab("request")}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "request"
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Solicitar Exámenes
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "results"
                  ? "bg-orange-600 text-white"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              Ver Resultados
            </button>
          </div>
        </div>

        {/* Request Exams Tab */}
        {activeTab === "request" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {examTypes.map((exam) => (
                <div
                  key={exam.id}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedExam?.id === exam.id
                      ? "ring-2 ring-orange-500 shadow-xl"
                      : "hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedExam(exam)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exam.name}
                    </h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {exam.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {exam.description}
                  </p>

                  <div className="text-2xl font-bold text-orange-600 mb-3">
                    ${exam.price.toLocaleString()}
                  </div>

                  <div className="text-xs text-gray-500">
                    <strong>Preparación:</strong>{" "}
                    {exam.preparation_instructions}
                  </div>

                  {selectedExam?.id === exam.id && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mt-3">
                      <p className="text-orange-800 text-sm font-medium">
                        ✓ Examen seleccionado
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Request Form */}
            {selectedExam && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Solicitar: {selectedExam.name}
                </h2>

                <form onSubmit={handleRequestExam} className="space-y-6">
                  {message && (
                    <div
                      className={`p-4 rounded-lg ${
                        message.includes("exitosamente")
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-red-50 border border-red-200 text-red-800"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Mascota *
                      </label>
                      <input
                        type="text"
                        value={requestData.pet_name}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            pet_name: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Especie *
                      </label>
                      <select
                        value={requestData.pet_species}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            pet_species: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Selecciona la especie</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Conejo">Conejo</option>
                        <option value="Ave">Ave</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha Preferida *
                      </label>
                      <input
                        type="date"
                        value={requestData.preferred_date}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            preferred_date: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora Preferida *
                      </label>
                      <select
                        value={requestData.preferred_time}
                        onChange={(e) =>
                          setRequestData({
                            ...requestData,
                            preferred_time: e.target.value,
                          })
                        }
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Selecciona una hora</option>
                        <option value="08:00">8:00 AM</option>
                        <option value="09:00">9:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notas Adicionales
                    </label>
                    <textarea
                      value={requestData.notes}
                      onChange={(e) =>
                        setRequestData({
                          ...requestData,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Información adicional sobre tu mascota o el motivo del examen..."
                    />
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      📋 Instrucciones de Preparación:
                    </h4>
                    <p className="text-blue-700 text-sm">
                      {selectedExam.preparation_instructions}
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium text-gray-900">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        ${selectedExam.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      {loading ? "Enviando solicitud..." : "Solicitar Examen"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-6">
            {examResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  No tienes resultados de exámenes
                </h3>
                <p className="text-gray-600 mb-6">
                  Los resultados aparecerán aquí una vez que se completen los
                  exámenes
                </p>
                <button
                  onClick={() => setActiveTab("request")}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
                >
                  Solicitar Primer Examen
                </button>
              </div>
            ) : (
              examResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {result.exam_name}
                      </h3>
                      <p className="text-gray-600">
                        Mascota: {result.pet_name} | Fecha:{" "}
                        {formatDate(result.exam_date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Veterinario: {result.veterinarian_name}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Completado
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Resultados:
                    </h4>
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                      {result.results}
                    </pre>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                      📧 Enviar por email
                    </button>
                    <button className="text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg">
                      🖨️ Imprimir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
