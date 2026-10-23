import React from 'react';
import type { CategoriaEquipo } from '../../types/equipo';

export interface FiltrosInventarioProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  categoriaSeleccionada: string;
  onCategoriaChange: (categoria: string) => void;
}

const CATEGORIAS: CategoriaEquipo[] = ['Monitor', 'Teclado', 'Mouse'];

export const FiltrosInventario: React.FC<FiltrosInventarioProps> = ({
  busqueda,
  onBusquedaChange,
  categoriaSeleccionada,
  onCategoriaChange,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3.5 mb-6 flex flex-col sm:flex-row gap-3">
      {/* Input de búsqueda por nombre */}
      <div className="flex-1">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar equipo por nombre..."
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Select de filtro por categoría */}
      <div className="sm:w-56">
        <select
          value={categoriaSeleccionada}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
