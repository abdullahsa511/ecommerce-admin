// ==========================================================================
// exportUtils.d.ts
// Type declarations for exportUtils.js
// Dependency-free CSV / XLSX / PDF export utilities — reusable anywhere.
// ==========================================================================

export interface ExportColumn<T = any> {
  /** Property name on the row object. Required unless `accessor` is provided. */
  key?: string;
  /** Column header label shown in CSV/XLSX/PDF. */
  header: string;
  /** Optional custom value getter, overrides `key` lookup. */
  accessor?: (row: T) => string | number;
  /** Optional column width in px — used for PDF table layout. */
  width?: number;
  /** Render this column's value as a pill/badge in the PDF table. */
  badge?: boolean;
}

export interface ExportOptions<T = any> {
  /** Column definitions shared across CSV, XLSX, and PDF export. */
  columns: ExportColumn<T>[];
  /** Row data to export. */
  data: T[];
  /** Base file name (without extension), e.g. "bookings_report". */
  fileName?: string;
  /** PDF report title (also used as XLSX sheet name fallback context). */
  title?: string;
  /** PDF report subtitle, e.g. a date range or reporting period. */
  subtitle?: string;
  /** PDF paper size. Defaults to 'A3'. */
  paperSize?: 'A4' | 'A3' | 'A2' | 'Letter';
  /** PDF page orientation. Defaults to 'portrait'. */
  orientation?: 'portrait' | 'landscape';
}

export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

/**
 * Triggers a browser download of the given Blob with the given file name.
 */
export function downloadBlob(blob: Blob, fileName: string): void;

/**
 * Escapes a value for safe inclusion in XML/HTML output.
 */
export function xmlEscape(value: unknown): string;

/**
 * Exports data as a CSV file and triggers a download.
 */
export function exportToCSV<T = any>(opts: ExportOptions<T>): void;

/**
 * Exports data as a real .xlsx file (hand-built ZIP/OOXML, no library)
 * and triggers a download.
 */
export function exportToXLSX<T = any>(opts: ExportOptions<T>): void;

/**
 * Sanitizes a string for safe use as a file name.
 */
export function sanitizeFileName(name: string): string;

/**
 * Exports data as a PDF file (A3 by default) and triggers a direct download.
 */
export function exportToPDF<T = any>(opts: ExportOptions<T>): void;

/**
 * Single entry point — exports data in the given format.
 */
export function exportTableData<T = any>(format: ExportFormat, opts: ExportOptions<T>): void;