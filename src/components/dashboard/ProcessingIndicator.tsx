import { motion } from 'framer-motion';
import { Loader2, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessingIndicatorProps {
  stage: 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete';
}

const stages = [
  { key: 'uploading', label: 'Uploading files' },
  { key: 'processing', label: 'OCR & preprocessing' },
  { key: 'analyzing', label: 'AI analysis' },
  { key: 'complete', label: 'Results ready' },
];

export function ProcessingIndicator({ stage }: ProcessingIndicatorProps) {
  if (stage === 'idle') return null;

  const currentIndex = stages.findIndex(s => s.key === stage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {stage === 'complete' ? (
            <Check className="w-5 h-5 text-success" />
          ) : (
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {stage === 'complete' ? 'Analysis Complete' : 'Processing Content'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {stage === 'complete' ? 'View results below' : 'AI models are analyzing your content'}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {stages.map((s, i) => {
          const isComplete = i < currentIndex || stage === 'complete';
          const isCurrent = s.key === stage && stage !== 'complete';
          
          return (
            <div key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isComplete && "bg-success text-success-foreground",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isComplete && !isCurrent && "bg-muted text-muted-foreground"
                )}>
                  {isComplete ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-2 text-center max-w-[80px]",
                  isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
              </div>
              
              {i < stages.length - 1 && (
                <div className={cn(
                  "w-12 h-0.5 mx-2",
                  i < currentIndex ? "bg-success" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Animated Processing Bar */}
      {stage !== 'complete' && (
        <div className="mt-6 h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-primary)' }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: 'easeInOut' 
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
