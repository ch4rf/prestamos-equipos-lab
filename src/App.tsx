import { useState, useEffect, useCallback } from 'react';
import type { Equipo } from './types/equipo';
import type { Prestamo } from './types/prestamo';
import { useEquipos } from './hooks/useEquipos';
import {
  obtenerPrestamosActivos,
  crearPrestamo,
  actualizarDisponibilidadEquipo,
  marcarPrestamoDevuelto,
} from './services/api';
import { Encabezado } from './components/Encabezado/Encabezado';
import { Inventario } from './pages/Inventario';
import { FormularioPrestamo } from './components/Prestamos/FormularioPrestamo';
import { TablaPrestamos } from './components/Prestamos/TablaPrestamos';

export default function App() {
  // Custom Hook useEquipos() para inventario, loading, error y recargar
  const { equipos, loading: loadingEquipos, error: errorEquipos, recargar: recargarEquipos, setEquipos } = useEquipos();

  // Estado para préstamos activos
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [equipoAprestar, setEquipoAprestar] = useState<Equipo | null>(null);
  const [vistaActiva, setVistaActiva] = useState<'inventario' | 'prestamos'>('inventario');

  // Carga de préstamos activos con useEffect al montar
  const cargarPrestamos = useCallback(async () => {
    try {
      const datos = await obtenerPrestamosActivos();
      setPrestamos(datos);
    } catch {
      // Si la API falla, los préstamos quedan vacíos y el usuario puede reintentar con el inventario
    }
  }, []);

  useEffect(() => {
    cargarPrestamos();
  }, [cargarPrestamos]);

  // Contadores derivados (sin duplicar estado)
  const totalEquipos = equipos.length;
  const equiposDisponibles = equipos.filter((e) => e.disponible).length;
  const prestamosActivos = prestamos.filter((p) => !p.devuelto);

  // Regla adicional Variante 7: Préstamos vencidos en el Encabezado
  const hoyStr = new Date().toISOString().split('T')[0];
  const prestamosVencidos = prestamosActivos.filter(
    (p) => p.fechaLimite < hoyStr
  ).length;

  // Iniciar flujo de préstamo
  const handleIniciarPrestamo = (id: number) => {
    const eq = equipos.find((e) => e.id === id);
    if (eq && eq.disponible) {
      setEquipoAprestar(eq);
    }
  };

  // Guardar préstamo en la API y actualizar interfaz
  const handleGuardarPrestamo = async (datosNuevoPrestamo: Omit<Prestamo, 'id'>) => {
    // 1. Guardar en API (POST /prestamos)
    const prestamoCreado = await crearPrestamo(datosNuevoPrestamo);

    // 2. Actualizar estado del equipo en API (PATCH /equipos/:id)
    await actualizarDisponibilidadEquipo(datosNuevoPrestamo.equipoId, false);

    // 3. Actualizar interfaz de forma inmutable
    setPrestamos((prev) => [...prev, prestamoCreado]);
    setEquipos((prev) =>
      prev.map((eq) =>
        eq.id === datosNuevoPrestamo.equipoId
          ? { ...eq, disponible: false }
          : eq
      )
    );

    setEquipoAprestar(null);
  };

  // Devolver préstamo en la API y restaurar equipo
  const handleDevolverPrestamo = async (prestamoId: number, equipoId: number) => {
    // 1. Marcar devuelto en API (PATCH /prestamos/:id)
    await marcarPrestamoDevuelto(prestamoId);

    // 2. Restaurar disponible en API (PATCH /equipos/:id)
    await actualizarDisponibilidadEquipo(equipoId, true);

    // 3. Actualizar interfaz de forma inmutable
    setPrestamos((prev) =>
      prev.map((p) => (p.id === prestamoId ? { ...p, devuelto: true } : p))
    );
    setEquipos((prev) =>
      prev.map((eq) =>
        eq.id === equipoId ? { ...eq, disponible: true } : eq
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Encabezado con título, disponibles y préstamos vencidos (regla variante 7) */}
      <Encabezado
        totalEquipos={totalEquipos}
        equiposDisponibles={equiposDisponibles}
        prestamosVencidos={prestamosVencidos}
      />

      {/* Navegación por pestañas */}
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
            Préstamos Activos ({prestamosActivos.length})
          </button>
        </div>
      </div>

      {/* Vistas */}
      {vistaActiva === 'inventario' ? (
        <Inventario
          equipos={equipos}
          loading={loadingEquipos}
          error={errorEquipos}
          onReintentar={recargarEquipos}
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
