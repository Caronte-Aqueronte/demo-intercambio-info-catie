/**
 * Recurso que representa un archivo almacenado en el sistema
 */
export interface ApiFile {
  id: number;
  original_name: string;
  extension: string;
  size: number;
  download_url: string;
  published_at: string;
  external_id: string;
  published_by: string;
}
