import React from 'react';
import type { Equipo } from '../../types/equipo';
import { TarjetaEquipo } from './TarjetaEquipo';

export interface ListaEquiposProps {
  equipos: Equipo[];
  onPrestar: (id: number) => void;
}

export const ListaEquipos: React.FC<ListaEquiposProps> = ({
  equipos,
  onPrestar,
}) => {
  if (equipos.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        No hay equipos disponibles en esta categoría.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {equipos.map((equipo) => (
        <TarjetaEquipo
          key={equipo.id}
          equipo={equipo}
          onPrestar={onPrestar}
        />
      ))}
    </div>
  );
};
