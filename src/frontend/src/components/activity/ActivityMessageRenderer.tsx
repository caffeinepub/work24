import React from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { Badge } from '../ui/badge';

interface ActivityMessageRendererProps {
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

// Helper function to extract message source
function extractMessageSource(data: Record<string, any>, t: (key: string) => string): string {
  const origin = data.origin || data.source || data.type;
  
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

// Helper function to generate human-readable summary
function generateSummary(data: Record<string, any>, t: (key: string) => string): string {
  const origin = data.origin || data.type;
  
  // Career application
  if (origin === 'career' || (data.skills && data.experience)) {
    const name = data.customerName || data.name || 'Someone';
    return `${name} applied for a career position`;
  }
  
  // Architect project
  if (origin === 'architect' || data.projectType) {
    const name = data.customerName || data.name || 'Someone';
    const projectType = data.projectType || 'project';
    return `${name} submitted an architect ${projectType} request`;
  }
  
  // Worker registration
  if (origin === 'worker' || data.category) {
    const name = data.name || 'A worker';
    const skill = data.skill || 'service';
    return `${name} registered as ${skill}`;
  }
  
  // Material submission
  if (origin === 'material' || data.description) {
    const name = data.name || 'A material';
    return `New material listed: ${name}`;
  }
  
  // Contact request
  if (data.targetId && data.targetType) {
    const name = data.customerName || 'Someone';
    const targetType = data.targetType === 'worker' ? 'worker' : 'material';
    return `${name} requested contact for a ${targetType}`;
  }
  
  // Fallback
  return 'New activity';
}

export default function ActivityMessageRenderer({ message }: ActivityMessageRendererProps) {
  const { t } = useI18n();
  
  const parsedData = parseJsonMessage(message);

  // If not JSON, display as plain text
  if (!parsedData) {
    return <p className="text-sm text-foreground">{message}</p>;
  }

  const source = extractMessageSource(parsedData, t);
  const summary = generateSummary(parsedData, t);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {source}
        </Badge>
      </div>
      <p className="text-sm text-foreground">{summary}</p>
    </div>
  );
}
