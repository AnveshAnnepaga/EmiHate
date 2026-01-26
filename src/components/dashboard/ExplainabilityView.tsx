import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HighlightedWord {
  text: string;
  impact: number; // -1 to 1 (negative = reduces hate, positive = increases hate)
  isHighlighted: boolean;
}

const mockText: HighlightedWord[] = [
  { text: 'These', impact: 0, isHighlighted: false },
  { text: 'people', impact: 0.3, isHighlighted: true },
  { text: 'are', impact: 0, isHighlighted: false },
  { text: 'completely', impact: 0.2, isHighlighted: true },
  { text: 'worthless', impact: 0.95, isHighlighted: true },
  { text: 'and', impact: 0, isHighlighted: false },
  { text: 'should', impact: 0.4, isHighlighted: true },
  { text: 'be', impact: 0, isHighlighted: false },
  { text: 'eliminated', impact: 0.98, isHighlighted: true },
  { text: 'from', impact: 0, isHighlighted: false },
  { text: 'our', impact: 0.1, isHighlighted: true },
  { text: 'society.', impact: 0.6, isHighlighted: true },
];

const explanations = [
  {
    term: 'worthless',
    impact: 0.95,
    reason: 'Dehumanizing language that denies value to a group of people',
  },
  {
    term: 'eliminated',
    impact: 0.98,
    reason: 'Violent terminology suggesting removal or harm to individuals',
  },
  {
    term: 'society',
    impact: 0.6,
    reason: 'Context implies exclusionary ideology against a group',
  },
];

export function ExplainabilityView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Text Highlight View */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">LIME/SHAP Highlights</h3>
            <p className="text-xs text-muted-foreground">Word-level impact visualization</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-severity-high/60" />
            <span className="text-muted-foreground">High Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-severity-medium/60" />
            <span className="text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary/30" />
            <span className="text-muted-foreground">Low</span>
          </div>
        </div>

        {/* Highlighted Text */}
        <div className="p-4 rounded-xl bg-muted/30 leading-relaxed">
          {mockText.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className={cn(
                "inline-block mr-1 px-1 py-0.5 rounded transition-all",
                word.isHighlighted && word.impact > 0.8 && "bg-severity-high/40 text-severity-high glow-primary",
                word.isHighlighted && word.impact > 0.5 && word.impact <= 0.8 && "bg-severity-medium/40 text-severity-medium",
                word.isHighlighted && word.impact > 0.1 && word.impact <= 0.5 && "bg-primary/30 text-primary",
                !word.isHighlighted && "text-foreground"
              )}
              style={{
                textShadow: word.impact > 0.8 ? '0 0 10px hsl(var(--severity-high) / 0.5)' : undefined
              }}
            >
              {word.text}
            </motion.span>
          ))}
        </div>

        {/* Impact Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Reduces Hate</span>
            <span>Increases Hate</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="w-1/2 bg-gradient-to-r from-severity-low to-transparent" />
            <div className="w-1/2 bg-gradient-to-l from-severity-high to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Explanation Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="font-semibold text-foreground mb-2">Why This Prediction?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          The model identified several linguistic markers that strongly correlate with hate speech patterns.
        </p>

        <div className="space-y-4">
          {explanations.map((exp, i) => (
            <motion.div
              key={exp.term}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">"{exp.term}"</span>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    exp.impact > 0.8 ? "bg-severity-high/10 text-severity-high" : "bg-severity-medium/10 text-severity-medium"
                  )}>
                    {Math.round(exp.impact * 100)}% impact
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{exp.reason}</p>
            </motion.div>
          ))}
        </div>

        {/* Model Info */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-card/50">
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Model:</span> RoBERTa-base fine-tuned on hate speech corpus
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-foreground font-medium">Explainability:</span> LIME with 5000 perturbations
          </p>
        </div>
      </motion.div>
    </div>
  );
}
