export type CategoriaEquipo = 'Monitor' | 'Teclado' | 'Mouse';

export interface Equipo {
  id: number;
  nombre: string;
  categoria: CategoriaEquipo;
  disponible: boolean;
}
