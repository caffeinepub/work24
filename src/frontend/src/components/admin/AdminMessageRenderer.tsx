import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useI18n } from '../../i18n/I18nProvider';
import {
  safeJsonParse,
  categorizeFields,
  formatValue,
  getFieldLabel,
} from '../../lib/adminMessageFormatting';

interface AdminMessageRendererProps {
  messageText: string;
}

export function AdminMessageRenderer({ messageText }: AdminMessageRendererProps) {
  const { t } = useI18n();
  const [showRaw, setShowRaw] = useState(false);
  
  const parsed = safeJsonParse(messageText);

  // If not JSON, just show plain text
  if (!parsed.isJson || !parsed.data) {
    return (
      <div className="whitespace-pre-wrap break-words">
        {messageText}
      </div>
    );
  }

  // If showing raw JSON
  if (showRaw) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRaw(false)}
          className="mb-2"
        >
          {t('admin.viewFormatted')}
        </Button>
        <pre className="whitespace-pre-wrap break-words font-mono text-xs bg-muted p-3 rounded-md overflow-x-auto">
          {JSON.stringify(parsed.data, null, 2)}
        </pre>
      </div>
    );
  }

  // Formatted view
  const { recognized, other } = categorizeFields(parsed.data);

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowRaw(true)}
        className="mb-1"
      >
        {t('admin.viewRaw')}
      </Button>

      <Card className="p-3 space-y-2 bg-muted/30">
        {/* Recognized fields */}
        {Object.entries(recognized).map(([key, value]) => {
          const displayValue = formatValue(value);
          if (!displayValue) return null;

          return (
            <div key={key} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
              <div className="font-medium text-muted-foreground">
                {getFieldLabel(key, t)}:
              </div>
              <div className="whitespace-pre-wrap break-words">
                {displayValue}
              </div>
            </div>
          );
        })}

        {/* Other fields section */}
        {Object.keys(other).length > 0 && (
          <div className="pt-2 mt-2 border-t">
            <div className="font-medium text-sm text-muted-foreground mb-2">
              {t('admin.otherFields')}:
            </div>
            <div className="space-y-1 pl-2">
              {Object.entries(other).map(([key, value]) => {
                const displayValue = formatValue(value);
                if (!displayValue) return null;

                return (
                  <div key={key} className="grid grid-cols-[100px_1fr] gap-2 text-xs">
                    <div className="font-medium text-muted-foreground">
                      {key}:
                    </div>
                    <div className="whitespace-pre-wrap break-words">
                      {displayValue}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
