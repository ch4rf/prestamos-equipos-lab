export interface Prestamo {
  id: number;
  equipoId: number;
  solicitante: string;
  carne: string;
  fechaPrestamo: string; // Formato ISO 8601
  fechaLimite: string;   // Formato ISO 8601
  devuelto: boolean;
}
