import { useState } from 'react';
import type { Equipo } from './types/equipo';
import type { Prestamo } from './types/prestamo';
import { EQUIPOS_INICIALES } from './data/equiposIniciales';
import { PRESTAMOS_INICIALES } from './data/prestamosIniciales';
import { Encabezado } from './components/Encabezado/Encabezado';
import { Inventario } from './pages/Inventario';
import { FormularioPrestamo } from './components/Prestamos/FormularioPrestamo';
import { TablaPrestamos } from './components/Prestamos/TablaPrestamos';

export default function App() {
  // Estados principales de la aplicación (Parte 2: Estado local con useState)
  const [equipos, setEquipos] = useState<Equipo[]>(EQUIPOS_INICIALES);
  const [prestamos, setPrestamos] = useState<Prestamo[]>(PRESTAMOS_INICIALES);
  const [equipoAprestar, setEquipoAprestar] = useState<Equipo | null>(null);
  const [vistaActiva, setVistaActiva] = useState<'inventario' | 'prestamos'>('inventario');

  // Estado derivado: cálculo directo sin duplicar estado
  const totalEquipos = equipos.length;
  const equiposDisponibles = equipos.filter((e) => e.disponible).length;
  const prestamosActivosCount = prestamos.filter((p) => !p.devuelto).length;

  // Abrir modal de préstamo
  const handleIniciarPrestamo = (id: number) => {
    const eq = equipos.find((e) => e.id === id);
    if (eq && eq.disponible) {
      setEquipoAprestar(eq);
    }
  };

  // Guardar nuevo préstamo (actualización 100% inmutable)
  const handleGuardarPrestamo = (datosNuevoPrestamo: Omit<Prestamo, 'id'>) => {
    const nuevoId =
      prestamos.length > 0 ? Math.max(...prestamos.map((p) => p.id)) + 1 : 1;

    const nuevoPrestamo: Prestamo = {
      ...datosNuevoPrestamo,
      id: nuevoId,
    };

    // Agregar préstamo inmutablemente con spread
    setPrestamos((prev) => [...prev, nuevoPrestamo]);

    // Marcar el equipo como disponible: false inmutablemente con map
    setEquipos((prev) =>
      prev.map((eq) =>
        eq.id === datosNuevoPrestamo.equipoId
          ? { ...eq, disponible: false }
          : eq
      )
    );

    // Cerrar modal
    setEquipoAprestar(null);
  };

  // Devolver préstamo (actualización 100% inmutable)
  const handleDevolverPrestamo = (prestamoId: number, equipoId: number) => {
    // Marcar devuelto: true inmutablemente
    setPrestamos((prev) =>
      prev.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
    );

    // Restaurar equipo a disponible: true inmutablemente
    setEquipos((prev) =>
      prev.map((eq) =>
        eq.id === equipoId ? { ...eq, disponible: true } : eq
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encabezado con título oficial y contadores */}
      <Encabezado
        totalEquipos={totalEquipos}
        equiposDisponibles={equiposDisponibles}
      />

      {/* Pestañas de navegación simples */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-4">
          <button
            type="button"
            onClick={() => setVistaActiva('inventario')}
            className={`py-3 px-2 text-sm font-medium border-b-2 cursor-pointer transition-colors ${
              vistaActiva === 'inventario'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Inventario de Equipos
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva('prestamos')}
            className={`py-3 px-2 text-sm font-medium border-b-2 cursor-pointer transition-colors ${
              vistaActiva === 'prestamos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Préstamos Activos ({prestamosActivosCount})
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {vistaActiva === 'inventario' ? (
        <Inventario
          equipos={equipos}
          onPrestar={handleIniciarPrestamo}
        />
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-6 w-full">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Préstamos Activos
            </h2>
            <p className="text-sm text-gray-500">
              Control de devoluciones y seguimiento de fechas de entrega
            </p>
          </div>
          <TablaPrestamos
            prestamos={prestamos}
            equipos={equipos}
            onDevolver={handleDevolverPrestamo}
          />
        </main>
      )}

      {/* Modal controlado de Préstamo */}
      {equipoAprestar && (
        <FormularioPrestamo
          equipo={equipoAprestar}
          onGuardar={handleGuardarPrestamo}
          onCerrar={() => setEquipoAprestar(null)}
        />
      )}
    </div>
  );
}
