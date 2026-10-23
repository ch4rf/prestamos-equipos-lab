import { EQUIPOS_INICIALES } from './data/equiposIniciales';
import { Encabezado } from './components/Encabezado/Encabezado';
import { Inventario } from './pages/Inventario';

export default function App() {
  // Arreglo local para la Parte 1 (sin API todavía)
  const equipos = EQUIPOS_INICIALES;

  // Contador derivado directamente del arreglo (sin estado duplicado)
  const totalEquipos = equipos.length;
  const equiposDisponibles = equipos.filter((e) => e.disponible).length;

  const handlePrestar = (id: number) => {
    const equipo = equipos.find((e) => e.id === id);
    if (equipo) {
      alert(`Préstamo iniciado para: "${equipo.nombre}" (ID: ${equipo.id}).\nEn la Parte 2 se abrirá el formulario modal.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Encabezado
        totalEquipos={totalEquipos}
        equiposDisponibles={equiposDisponibles}
      />
      <Inventario
        equipos={equipos}
        onPrestar={handlePrestar}
      />
    </div>
  );
}
