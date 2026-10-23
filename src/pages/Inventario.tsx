import React, { useState } from 'react';
import type { Equipo } from '../types/equipo';
import { ListaEquipos } from '../components/Inventario/ListaEquipos';
import { FiltrosInventario } from '../components/Inventario/FiltrosInventario';

export interface InventarioProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export const Inventario: React.FC<InventarioProps> = ({
  equipos,
  onPrestar,
}) => {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');

  // Estado derivado: se combinan ambos filtros sin duplicar estado
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

      {/* Filtros combinados */}
      <FiltrosInventario
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        categoriaSeleccionada={categoriaSeleccionada}
        onCategoriaChange={setCategoriaSeleccionada}
      />

      {/* Lista de equipos filtrados */}
      <ListaEquipos
        equipos={equiposFiltrados}
        onPrestar={onPrestar}
      />
    </main>
  );
};
