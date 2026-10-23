import type { Equipo } from '../types/equipo';
import type { Prestamo } from '../types/prestamo';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Obtiene la lista completa de equipos desde la API REST.
 * Endpoint: GET /equipos
 */
export async function obtenerEquipos(): Promise<Equipo[]> {
  const respuesta = await fetch(`${BASE_URL}/equipos`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: No se pudo cargar el inventario.`);
  }
  return respuesta.json();
}

/**
 * Obtiene los préstamos activos (devuelto: false).
 * Endpoint: GET /prestamos?devuelto=false
 */
export async function obtenerPrestamosActivos(): Promise<Prestamo[]> {
  const respuesta = await fetch(`${BASE_URL}/prestamos?devuelto=false`);
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: No se pudieron cargar los préstamos activos.`);
  }
  return respuesta.json();
}

/**
 * Registra un nuevo préstamo en la base de datos.
 * Endpoint: POST /prestamos
 */
export async function crearPrestamo(
  prestamo: Omit<Prestamo, 'id'>
): Promise<Prestamo> {
  const respuesta = await fetch(`${BASE_URL}/prestamos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prestamo),
  });
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: No se pudo registrar el préstamo.`);
  }
  return respuesta.json();
}

/**
 * Actualiza la disponibilidad de un equipo.
 * Endpoint: PATCH /equipos/:id
 */
export async function actualizarDisponibilidadEquipo(
  id: number,
  disponible: boolean
): Promise<Equipo> {
  const respuesta = await fetch(`${BASE_URL}/equipos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disponible }),
  });
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: No se pudo actualizar el estado del equipo.`);
  }
  return respuesta.json();
}

/**
 * Marca un préstamo como devuelto.
 * Endpoint: PATCH /prestamos/:id
 */
export async function marcarPrestamoDevuelto(id: number): Promise<Prestamo> {
  const respuesta = await fetch(`${BASE_URL}/prestamos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ devuelto: true }),
  });
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status}: No se pudo marcar el préstamo como devuelto.`);
  }
  return respuesta.json();
}
