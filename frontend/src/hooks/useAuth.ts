/**
 * HOOK PERSONALIZADO DE AUTENTICACIÓN
 * ===================================
 * Este hook proporciona acceso al contexto de autenticación en cualquier componente.
 * 
 * Funcionalidad:
 * - Abstrae la lógica de autenticación del contexto
 * - Valida que se use dentro del AuthProvider
 * - Proporciona tipado TypeScript seguro
 * 
 * Uso en componentes:
 * const { user, login, logout } = useAuth();
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Validación: Asegurar que el hook se use dentro del provider
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};
