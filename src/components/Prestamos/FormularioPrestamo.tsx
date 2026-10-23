import React, { useState } from 'react';
import type { Equipo } from '../../types/equipo';
import type { Prestamo } from '../../types/prestamo';

export interface FormularioPrestamoProps {
  equipo: Equipo;
  onGuardar: (nuevoPrestamo: Omit<Prestamo, 'id'>) => Promise<void>;
  onCerrar: () => void;
}

interface ErroresFormulario {
  solicitante?: string;
  carne?: string;
  fechaLimite?: string;
  general?: string;
}

export const FormularioPrestamo: React.FC<FormularioPrestamoProps> = ({
  equipo,
  onGuardar,
  onCerrar,
}) => {
  // Inputs controlados
  const [solicitante, setSolicitante] = useState('');
  const [carne, setCarne] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cálculo de fechas permitidas (Variante 7: Máximo 5 días de préstamo)
  const MAX_DIAS_PRESTAMO = 5;
  const hoyStr = new Date().toISOString().split('T')[0];
  const maxFecha = new Date();
  maxFecha.setDate(maxFecha.getDate() + MAX_DIAS_PRESTAMO);
  const maxFechaStr = maxFecha.toISOString().split('T')[0];

  const validar = (): boolean => {
    const nuevosErrores: ErroresFormulario = {};

    // 1. Solicitante: obligatorio, mínimo 5 caracteres
    if (!solicitante.trim()) {
      nuevosErrores.solicitante = 'El nombre del solicitante es obligatorio.';
    } else if (solicitante.trim().length < 5) {
      nuevosErrores.solicitante = 'Debe ingresar al menos 5 caracteres.';
    }

    // 2. Carné: formato 0000-00-00000 mediante expresión regular
    const regexCarne = /^\d{4}-\d{2}-\d{4,5}$/;
    if (!carne.trim()) {
      nuevosErrores.carne = 'El número de carné es obligatorio.';
    } else if (!regexCarne.test(carne.trim())) {
      nuevosErrores.carne = 'Formato inválido. Debe ser 0000-00-00000 (ej. 0902-23-6637).';
    }

    // 3. Fecha límite: no anterior a hoy ni superar máximo 5 días
    if (!fechaLimite) {
      nuevosErrores.fechaLimite = 'La fecha límite es obligatoria.';
    } else {
      if (fechaLimite < hoyStr) {
        nuevosErrores.fechaLimite = 'La fecha límite no puede ser anterior al día de hoy.';
      } else if (fechaLimite > maxFechaStr) {
        nuevosErrores.fechaLimite = `El plazo máximo de préstamo es de ${MAX_DIAS_PRESTAMO} días (hasta el ${maxFechaStr}).`;
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onGuardar({
        equipoId: equipo.id,
        solicitante: solicitante.trim(),
        carne: carne.trim(),
        fechaPrestamo: hoyStr,
        fechaLimite,
        devuelto: false,
      });
    } catch (err) {
      setErrores((prev) => ({
        ...prev,
        general:
          err instanceof Error
            ? err.message
            : 'Error al registrar el préstamo en la API.',
      }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg border border-gray-200 max-w-md w-full p-6 shadow-lg">
        {/* Cabecera del modal */}
        <div className="flex justify-between items-start mb-4 pb-2 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Registrar Préstamo
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Equipo: <strong className="text-gray-800">{equipo.nombre}</strong> ({equipo.categoria})
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {errores.general && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded">
            {errores.general}
          </div>
        )}

        {/* Formulario controlado */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Solicitante */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Nombre del Solicitante
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              value={solicitante}
              onChange={(e) => setSolicitante(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errores.solicitante
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errores.solicitante && (
              <p className="text-red-600 text-xs mt-1 font-medium">
                {errores.solicitante}
              </p>
            )}
          </div>

          {/* Campo: Carné */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Número de Carné
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              value={carne}
              onChange={(e) => setCarne(e.target.value)}
              placeholder="0902-23-6637"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errores.carne
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errores.carne && (
              <p className="text-red-600 text-xs mt-1 font-medium">
                {errores.carne}
              </p>
            )}
          </div>

          {/* Campo: Fecha Límite */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Fecha Límite (Máximo 5 días)
            </label>
            <input
              type="date"
              disabled={isSubmitting}
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
                errores.fechaLimite
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/30'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            />
            {errores.fechaLimite && (
              <p className="text-red-600 text-xs mt-1 font-medium">
                {errores.fechaLimite}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Rango permitido: de hoy hasta el {maxFechaStr}.
            </p>
          </div>

          {/* Botones de acción (el botón de envío se deshabilita mientras se procesa para evitar dobles registros) */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onCerrar}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded font-medium cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded font-medium cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando préstamo...' : 'Guardar Préstamo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
