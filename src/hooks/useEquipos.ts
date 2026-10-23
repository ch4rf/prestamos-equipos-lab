import { useState, useEffect, useCallback } from 'react';
import type { Equipo } from '../types/equipo';
import { obtenerEquipos } from '../services/api';

export interface UseEquiposReturn {
  equipos: Equipo[];
  loading: boolean;
  error: string | null;
  recargar: () => Promise<void>;
  setEquipos: React.Dispatch<React.SetStateAction<Equipo[]>>;
}

export function useEquipos(): UseEquiposReturn {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarEquipos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const datos = await obtenerEquipos();
      setEquipos(datos);
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : 'Error desconocido al conectar con la API de equipos.';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect con arreglo de dependencias vacío para cargar al montar
  useEffect(() => {
    cargarEquipos();
  }, [cargarEquipos]);

  return {
    equipos,
    loading,
    error,
    recargar: cargarEquipos,
    setEquipos,
  };
}
