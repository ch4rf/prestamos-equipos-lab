import React, { useState } from 'react';
import type { Prestamo } from '../../types/prestamo';
import type { Equipo } from '../../types/equipo';

export interface TablaPrestamosProps {
  prestamos: Prestamo[];
  equipos: Equipo[];
  onDevolver: (prestamoId: number, equipoId: number) => Promise<void>;
}

export const TablaPrestamos: React.FC<TablaPrestamosProps> = ({
  prestamos,
  equipos,
  onDevolver,
}) => {
  const hoyStr = new Date().toISOString().split('T')[0];
  const [devolviendoId, setDevolviendoId] = useState<number | null>(null);

  // Solo préstamos que no hayan sido devueltos
  const prestamosActivos = prestamos.filter((p) => !p.devuelto);

  const obtenerNombreEquipo = (equipoId: number) => {
    const eq = equipos.find((e) => e.id === equipoId);
    return eq ? eq.nombre : `Equipo #${equipoId}`;
  };

  const handleDevolver = async (prestamoId: number, equipoId: number) => {
    try {
      setDevolviendoId(prestamoId);
      await onDevolver(prestamoId, equipoId);
    } finally {
      setDevolviendoId(null);
    }
  };

  if (prestamosActivos.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
        No hay préstamos activos en este momento.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th className="py-3 px-4">Equipo</th>
            <th className="py-3 px-4">Solicitante</th>
            <th className="py-3 px-4">Carné</th>
            <th className="py-3 px-4">Fecha Límite</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {prestamosActivos.map((prestamo) => {
            const estaVencido = prestamo.fechaLimite < hoyStr;
            const estaProcesando = devolviendoId === prestamo.id;

            return (
              <tr
                key={prestamo.id}
                className={
                  estaVencido
                    ? 'bg-red-50 text-red-950 font-medium'
                    : 'hover:bg-gray-50/70 text-gray-800'
                }
              >
                <td className="py-3 px-4 font-semibold">
                  {obtenerNombreEquipo(prestamo.equipoId)}
                </td>
                <td className="py-3 px-4">{prestamo.solicitante}</td>
                <td className="py-3 px-4 font-mono text-xs">{prestamo.carne}</td>
                <td className="py-3 px-4 font-mono text-xs">
                  {prestamo.fechaLimite}
                </td>
                <td className="py-3 px-4">
                  {estaVencido ? (
                    <span className="inline-block bg-red-100 text-red-800 border border-red-200 text-xs px-2 py-0.5 rounded font-semibold">
                      Vencido
                    </span>
                  ) : (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                      En plazo
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDevolver(prestamo.id, prestamo.equipoId)}
                    disabled={estaProcesando}
                    className="bg-gray-700 hover:bg-gray-900 disabled:bg-gray-400 text-white text-xs px-3 py-1.5 rounded font-medium cursor-pointer disabled:cursor-not-allowed transition-colors"
                  >
                    {estaProcesando ? 'Devolviendo...' : 'Devolver'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
