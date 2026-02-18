import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '../../i18n/I18nProvider';
import {
  safeJsonParse,
  categorizeFields,
  formatValue,
  getFieldLabel,
  getMessageSource,
} from '../../lib/adminMessageFormatting';

interface AdminMessageRendererProps {
  messageText: string;
}

export function AdminMessageRenderer({ messageText }: AdminMessageRendererProps) {
  const { t } = useI18n();
  const [showRaw, setShowRaw] = useState(false);
  
  const parsed = safeJsonParse(messageText);
  const source = getMessageSource(messageText, t);

  // If not JSON, just show plain text with source badge
  if (!parsed.isJson || !parsed.data) {
    return (
      <div className="space-y-2">
        <Badge variant="outline" className="mb-2">
          {source}
        </Badge>
        <div className="whitespace-pre-wrap break-words">
          {messageText}
        </div>
      </div>
    );
  }

  // If showing raw JSON
  if (showRaw) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{source}</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRaw(false)}
            className="text-xs"
          >
            {t('admin.viewFormatted')}
          </Button>
        </div>
        <pre className="text-xs bg-muted p-3 rounded overflow-x-auto whitespace-pre-wrap break-words">
          {JSON.stringify(parsed.data, null, 2)}
        </pre>
      </div>
    );
  }

  // Formatted view
  const { recognized, other } = categorizeFields(parsed.data);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className="font-medium">
          {source}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRaw(true)}
          className="text-xs"
        >
          {t('admin.viewRaw')}
        </Button>
      </div>
      
      <Card className="p-3 bg-muted/30">
        <div className="space-y-2">
          {Object.entries(recognized).map(([key, value]) => {
            // Skip origin field as it's already shown in the badge
            if (key === 'origin') return null;
            
            const displayValue = formatValue(value);
            if (!displayValue) return null;
            
            return (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {getFieldLabel(key, t)}
                </span>
                <span className="text-sm whitespace-pre-wrap break-words">
                  {displayValue}
                </span>
              </div>
            );
          })}
          
          {Object.keys(other).length > 0 && (
            <div className="pt-2 border-t">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t('admin.otherFields')}
              </span>
              <div className="mt-1 space-y-1">
                {Object.entries(other).map(([key, value]) => (
                  <div key={key} className="text-xs">
                    <span className="font-medium">{key}:</span>{' '}
                    <span className="text-muted-foreground">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
