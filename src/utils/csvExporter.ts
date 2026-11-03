export interface ScanHistoryRecord {
  id: string;
  timestamp: number;
  rawContent: string;
  format: string;
  type: string;
  title: string;
  isFavorite: boolean;
}

/**
 * Escapes a single field value for RFC 4180 CSV compliance
 */
export function escapeCsvField(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  // If string contains comma, quote, or newline, escape internal quotes by doubling them and enclose in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates CSV string for scan history export
 */
export function exportScanHistoryToCsv(records: ScanHistoryRecord[]): string {
  const headers = ['ID', 'Date & Time', 'Format', 'Type', 'Title', 'Content', 'Favorite'];
  const rows = records.map(r => {
    const dateStr = new Date(r.timestamp).toISOString();
    return [
      escapeCsvField(r.id),
      escapeCsvField(dateStr),
      escapeCsvField(r.format),
      escapeCsvField(r.type),
      escapeCsvField(r.title),
      escapeCsvField(r.rawContent),
      escapeCsvField(r.isFavorite ? 'Yes' : 'No')
    ].join(',');
  });

  return [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
}
