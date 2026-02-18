/**
 * Helper functions for parsing and formatting admin messages.
 * Safely parses JSON, extracts recognized fields, and formats values.
 */

export interface ParsedMessage {
  isJson: boolean;
  data: Record<string, any> | null;
}

/**
 * Safely parse a message string as JSON
 */
export function safeJsonParse(text: string): ParsedMessage {
  try {
    const trimmed = text.trim();
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return { isJson: false, data: null };
    }
    
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === 'object' && parsed !== null) {
      return { isJson: true, data: parsed };
    }
    return { isJson: false, data: null };
  } catch {
    return { isJson: false, data: null };
  }
}

/**
 * List of recognized field keys that should be highlighted
 */
export const RECOGNIZED_FIELDS = [
  'type',
  'customerName',
  'name',
  'mobile',
  'requirement',
  'message',
  'details',
  'location',
  'budget',
  'skills',
  'experience',
  'timestamp',
  'projectType',
  'category',
  'description',
];

/**
 * Extract recognized and other fields from parsed data
 */
export function categorizeFields(data: Record<string, any>): {
  recognized: Record<string, any>;
  other: Record<string, any>;
} {
  const recognized: Record<string, any> = {};
  const other: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (RECOGNIZED_FIELDS.includes(key)) {
      recognized[key] = value;
    } else {
      other[key] = value;
    }
  }

  return { recognized, other };
}

/**
 * Format a value for display (handle arrays, objects, etc.)
 */
export function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (Array.isArray(value)) {
    return `${value.length} item${value.length !== 1 ? 's' : ''}`;
  }
  
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    return `${keys.length} field${keys.length !== 1 ? 's' : ''}`;
  }
  
  return String(value);
}

/**
 * Get a human-readable label for a field key
 */
export function getFieldLabel(key: string, t: (key: string) => string): string {
  const labelKey = `admin.field.${key}`;
  const translated = t(labelKey);
  
  // If translation returns the key itself, fall back to capitalized key
  if (translated === labelKey) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  }
  
  return translated;
}
