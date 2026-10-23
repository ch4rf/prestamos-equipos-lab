import React from 'react';
import type { Equipo } from '../types/equipo';
import { ListaEquipos } from '../components/Inventario/ListaEquipos';

export interface InventarioProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export const Inventario: React.FC<InventarioProps> = ({
  equipos,
  onPrestar,
}) => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-gray-800">
          Inventario de Equipos
        </h2>
        <p className="text-sm text-gray-500">
          Selecciona un equipo para iniciar el préstamo
        </p>
      </div>

      <ListaEquipos
        equipos={equipos}
        onPrestar={onPrestar}
      />
    </main>
  );
};
