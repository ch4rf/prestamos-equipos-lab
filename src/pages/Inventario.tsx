import React, { useState } from 'react';
import type { Equipo } from '../types/equipo';
import { ListaEquipos } from '../components/Inventario/ListaEquipos';
import { FiltrosInventario } from '../components/Inventario/FiltrosInventario';

export interface InventarioProps {
  equipos: Equipo[];
  loading: boolean;
  error: string | null;
  onReintentar: () => void;
  onPrestar: (id: number) => void;
}

export const Inventario: React.FC<InventarioProps> = ({
  equipos,
  loading,
  error,
  onReintentar,
  onPrestar,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  // Estado derivado: filtros combinados
  const equiposFiltrados = equipos.filter((equipo) => {
    const coincideNombre = equipo.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada
      ? equipo.categoria === categoriaSeleccionada
      : true;
    return coincideNombre && coincideCategoria;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          Inventario de Equipos
        </h2>
        <p className="text-sm text-gray-500">
          Filtra por nombre o categoría y selecciona un equipo disponible
        </p>
      </div>

      {/* 1. Estado de Carga (Loading) */}
      {loading && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center my-4">
          <div className="inline-block w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-gray-600 text-sm font-medium">
            Cargando equipos desde la API REST...
          </p>
        </div>
      )}

      {/* 2. Estado de Error con Botón Reintentar */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-4">
          <h3 className="text-red-800 font-semibold text-base mb-1">
            No se pudo conectar con el servidor
          </h3>
          <p className="text-red-600 text-sm mb-4">
            {error}
          </p>
          <button
            type="button"
            onClick={onReintentar}
            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded cursor-pointer transition-colors shadow-xs"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* 3. Contenido Principal cuando no hay error ni carga */}
      {!loading && !error && (
        <>
          <FiltrosInventario
            busqueda={busqueda}
            onBusquedaChange={setBusqueda}
            categoriaSeleccionada={categoriaSeleccionada}
            onCategoriaChange={setCategoriaSeleccionada}
          />

          <ListaEquipos
            equipos={equiposFiltrados}
            onPrestar={onPrestar}
          />
        </>
      )}
    </main>
  );
};
