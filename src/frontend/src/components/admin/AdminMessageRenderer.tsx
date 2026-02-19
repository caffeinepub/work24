import React, { useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdminMessageRendererProps {
  message: string;
}

// Helper function to parse JSON message
function parseJsonMessage(text: string): Record<string, any> | null {
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper function to categorize fields
function categorizeFields(data: Record<string, any>): {
  recognized: [string, any][];
  other: [string, any][];
} {
  const recognizedKeys = [
    'origin',
    'customerName',
    'mobile',
    'requirements',
    'targetId',
    'targetType',
    'name',
    'projectType',
    'location',
    'budget',
    'message',
    'skills',
    'experience',
  ];

  const recognized: [string, any][] = [];
  const other: [string, any][] = [];

  for (const [key, value] of Object.entries(data)) {
    if (recognizedKeys.includes(key)) {
      recognized.push([key, value]);
    } else {
      other.push([key, value]);
    }
  }

  return { recognized, other };
}

// Helper function to format field values
function formatFieldValue(value: any): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}

// Helper function to get field label
function getFieldLabel(key: string, t: (key: string) => string): string {
  const labelMap: Record<string, string> = {
    origin: t('admin.source'),
    customerName: t('admin.customerName'),
    mobile: t('admin.mobile'),
    requirements: t('admin.requirements'),
    targetId: t('admin.targetId'),
    targetType: t('admin.targetType'),
    name: t('admin.name'),
    projectType: t('admin.projectType'),
    location: t('admin.location'),
    budget: t('admin.budget'),
    message: t('admin.message'),
    skills: t('admin.skills'),
    experience: t('admin.experience'),
  };

  return labelMap[key] || key;
}

// Helper function to extract message source
function extractMessageSource(data: Record<string, any>, t: (key: string) => string): string {
  const origin = data.origin || data.source;
  
  if (origin) {
    const sourceKey = `adminSource.${origin}`;
    const translated = t(sourceKey);
    return translated !== sourceKey ? translated : origin;
  }

  // Try to infer from fields
  if (data.projectType) return t('adminSource.architect');
  if (data.skills && data.experience) return t('adminSource.career');
  if (data.targetId && data.targetType) return t('adminSource.worker-contact');
  
  return t('adminSource.unknown');
}

export default function AdminMessageRenderer({ message }: AdminMessageRendererProps) {
  const { t } = useI18n();
  const [showRaw, setShowRaw] = useState(false);

  const parsedData = parseJsonMessage(message);

  if (!parsedData) {
    return <div className="text-admin-foreground whitespace-pre-wrap break-words">{message}</div>;
  }

  const { recognized, other } = categorizeFields(parsedData);
  const source = extractMessageSource(parsedData, t);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-admin-accent/20 text-admin-foreground border-admin-border">
          {t('admin.structuredMessage')}
        </Badge>
        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
          {source}
        </Badge>
      </div>

      {!showRaw ? (
        <div className="space-y-1.5 text-sm">
          {recognized.map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <span className="font-medium text-admin-foreground min-w-[120px]">
                {getFieldLabel(key, t)}:
              </span>
              <span className="text-admin-muted">{formatFieldValue(value)}</span>
            </div>
          ))}
          {other.length > 0 && (
            <>
              <div className="border-t border-admin-border my-2 pt-2">
                <span className="text-xs text-admin-muted">{t('admin.additionalFields')}</span>
              </div>
              {other.map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <span className="font-medium text-admin-foreground min-w-[120px]">{key}:</span>
                  <span className="text-admin-muted">{formatFieldValue(value)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <pre className="text-xs bg-admin-accent/30 p-3 rounded border border-admin-border overflow-x-auto text-admin-foreground">
          {JSON.stringify(parsedData, null, 2)}
        </pre>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowRaw(!showRaw)}
        className="text-xs text-admin-muted hover:text-admin-foreground"
      >
        {showRaw ? (
          <>
            <ChevronUp className="h-3 w-3 mr-1" />
            {t('admin.showFormatted')}
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3 mr-1" />
            {t('admin.showRaw')}
          </>
        )}
      </Button>
    </div>
  );
}
