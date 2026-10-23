import React from 'react';

export interface EncabezadoProps {
  totalEquipos: number;
  equiposDisponibles: number;
  prestamosVencidos: number; // Regla obligatoria variante 7
}

export const Encabezado: React.FC<EncabezadoProps> = ({
  totalEquipos,
  equiposDisponibles,
  prestamosVencidos,
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

        <div className="flex flex-wrap items-center gap-2">
          {/* Contador de equipos disponibles */}
          <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded border border-gray-200">
            Disponibles: <strong className="text-gray-900">{equiposDisponibles}</strong> de <strong className="text-gray-900">{totalEquipos}</strong>
          </span>

          {/* Regla adicional Variante 7: Contador de préstamos vencidos */}
          <span
            className={`text-sm px-3 py-1.5 rounded border font-medium ${
              prestamosVencidos > 0
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-green-50 text-green-700 border-green-200'
            }`}
          >
            Vencidos:{' '}
            <strong className={prestamosVencidos > 0 ? 'text-red-900' : 'text-green-900'}>
              {prestamosVencidos}
            </strong>
          </span>
        </div>
      </div>
    </header>
  );
};
