// Contexto de autenticación para manejar el estado del usuario
// Comunicación entre Frontend (puerto 5173) y Backend (puerto 3000)
import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Verificar token almacenado al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verificar si el token JWT es válido con el backend
      fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Token inválido");
        })
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Función de login - Comunicación con el backend
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Enviar credenciales al backend
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Procesar respuesta del backend
      const data = await response.json();

      if (response.ok) {
        // Guardar token y actualizar estado
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return true;
      } else {
        console.error("Error de login:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return true;
      } else {
        console.error("Error de registro:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
