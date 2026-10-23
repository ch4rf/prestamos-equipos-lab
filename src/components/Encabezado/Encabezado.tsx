import React from 'react';

export interface EncabezadoProps {
  totalEquipos: number;
  equiposDisponibles: number;
}

export const Encabezado: React.FC<EncabezadoProps> = ({
  totalEquipos,
  equiposDisponibles,
}) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Préstamos Lab — 0902-23-6637
          </h1>
          <p className="text-sm text-gray-500">
            Control de equipos del laboratorio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-200">
            Disponibles: <strong className="text-gray-900">{equiposDisponibles}</strong> de <strong className="text-gray-900">{totalEquipos}</strong>
          </span>
        </div>
      </div>
    </header>
  );
};
