import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  color: string;
  medical_history: string;
  vaccinations: string;
  allergies: string;
  created_at: string;
}

const PetsPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    color: "",
    medical_history: "",
    vaccinations: "",
    allergies: "",
  });

  useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/pets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        setError("Error al cargar las mascotas");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem("token");
      const url = editingPet
        ? `http://localhost:3000/api/pets/${editingPet.id}`
        : "http://localhost:3000/api/pets";

      const method = editingPet ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
        }),
      });

      if (response.ok) {
        await fetchPets();
        resetForm();
        setShowForm(false);
      } else {
        setError("Error al guardar la mascota");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age.toString(),
      weight: pet.weight.toString(),
      color: pet.color,
      medical_history: pet.medical_history || "",
      vaccinations: pet.vaccinations || "",
      allergies: pet.allergies || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (petId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/pets/${petId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchPets();
      } else {
        setError("Error al eliminar la mascota");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      color: "",
      medical_history: "",
      vaccinations: "",
      allergies: "",
    });
    setEditingPet(null);
    setError("");
  };

  const getPetIcon = (species: string) => {
    const icons = {
      Perro: "🐕",
      Gato: "🐱",
      Conejo: "🐰",
      Ave: "🦜",
      Otro: "🐾",
    };
    return icons[species as keyof typeof icons] || "🐾";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acceso Restringido
          </h1>
          <p className="text-gray-600 mb-6">
            Debes iniciar sesión para gestionar tus mascotas
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mis Mascotas
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona la información de tus mascotas
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            + Agregar Mascota
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPet ? "Editar Mascota" : "Agregar Nueva Mascota"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Nombre de tu mascota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especie *
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) =>
                      setFormData({ ...formData, species: e.target.value })
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
                    Raza
                  </label>
                  <input
                    type="text"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Raza de tu mascota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad (años) *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    required
                    min="0"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Edad en años"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Peso en kilogramos"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Color del pelaje"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Historia Médica
                </label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medical_history: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Cirugías, enfermedades previas, tratamientos..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vacunas Aplicadas
                </label>
                <textarea
                  value={formData.vaccinations}
                  onChange={(e) =>
                    setFormData({ ...formData, vaccinations: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Lista de vacunas aplicadas y fechas..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias y Sensibilidades
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Alergias conocidas, medicamentos que no tolera..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {formLoading
                    ? "Guardando..."
                    : editingPet
                    ? "Actualizar"
                    : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pets List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mascotas...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🐾</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              No tienes mascotas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Agrega información de tus mascotas para un mejor cuidado
              veterinario
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
            >
              Agregar Primera Mascota
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">
                        {getPetIcon(pet.species)}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pet.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {pet.species} • {pet.breed}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Edad:</span>
                      <span>{pet.age} años</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peso:</span>
                      <span>{pet.weight} kg</span>
                    </div>
                    {pet.color && (
                      <div className="flex justify-between">
                        <span>Color:</span>
                        <span>{pet.color}</span>
                      </div>
                    )}
                  </div>

                  {pet.medical_history && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-800">
                        <strong>Historia médica:</strong> {pet.medical_history}
                      </p>
                    </div>
                  )}

                  {pet.allergies && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-800">
                        <strong>Alergias:</strong> {pet.allergies}
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(pet.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="mt-3">
                    <Link
                      to={`/servicios?pet=${pet.id}`}
                      className="block w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors duration-200"
                    >
                      Agendar Cita para {pet.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;
