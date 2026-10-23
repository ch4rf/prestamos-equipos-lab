import type { Prestamo } from '../types/prestamo';

// Préstamos iniciales para probar préstamos activos y filas vencidas
// Una fecha límite en el pasado para mostrar el resaltado de "Vencido"
const fechaAyer = new Date();
fechaAyer.setDate(fechaAyer.getDate() - 1);

const fechaFutura = new Date();
fechaFutura.setDate(fechaFutura.getDate() + 3);

export const PRESTAMOS_INICIALES: Prestamo[] = [
  {
    id: 1,
    equipoId: 3, // Monitor Samsung Odyssey G5
    solicitante: 'Carlos Mendoza',
    carne: '0902-23-6637',
    fechaPrestamo: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fechaLimite: fechaAyer.toISOString().split('T')[0], // VENCIDO
    devuelto: false,
  },
  {
    id: 2,
    equipoId: 5, // Teclado Logitech MX Keys
    solicitante: 'Andrea Morales',
    carne: '0902-21-14520',
    fechaPrestamo: new Date().toISOString().split('T')[0],
    fechaLimite: fechaFutura.toISOString().split('T')[0], // VIGENTE
    devuelto: false,
  },
];
