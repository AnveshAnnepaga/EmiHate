import { motion } from 'framer-motion';
import { Type, Globe } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputZoneProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInputZone({ value, onChange }: TextInputZoneProps) {
  const detectLanguage = (text: string): string => {
    const hindiChars = /[\u0900-\u097F]/;
    const teluguChars = /[\u0C00-\u0C7F]/;
    
    if (teluguChars.test(text)) return 'Telugu';
    if (hindiChars.test(text)) return 'Hindi';
    return 'English';
  };

  const detectedLanguage = value.trim() ? detectLanguage(value) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Type className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">Direct Text Input</span>
        </div>
        
        {detectedLanguage && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50">
            <Globe className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">{detectedLanguage}</span>
          </div>
        )}
      </div>

      <Textarea
        placeholder="Enter or paste text to analyze for hate speech, sentiment, and emotions. Supports English, Hindi (हिंदी), and Telugu (తెలుగు)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-h-[120px] bg-muted/30 border-border resize-none",
          "focus:border-primary/50 focus:ring-primary/20",
          "placeholder:text-muted-foreground/60"
        )}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{value.length} characters</span>
        <span>{value.trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </motion.div>
  );
}
