import React from 'react';
import type { Equipo } from '../../types/equipo';

export interface TarjetaEquipoProps {
  equipo: Equipo;
  onPrestar: (id: number) => void;
}

export const TarjetaEquipo: React.FC<TarjetaEquipoProps> = ({
  equipo,
  onPrestar,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">
            {equipo.categoria}
          </span>
          {equipo.disponible ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-medium">
              Disponible
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded font-medium">
              Prestado
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-base mb-1">
          {equipo.nombre}
        </h3>
        <p className="text-xs text-gray-400">ID #{equipo.id}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => onPrestar(equipo.id)}
          disabled={!equipo.disponible}
          className={`w-full py-1.5 px-3 rounded text-sm font-medium transition-colors ${
            equipo.disponible
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          Prestar
        </button>
      </div>
    </div>
  );
};
