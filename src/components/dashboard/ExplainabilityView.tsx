import { motion } from 'framer-motion';
import { Lightbulb, ChevronRight, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisResult } from '@/lib/analysisEngine';

interface HighlightedWord {
  text: string;
  impact: number;
  isHighlighted: boolean;
}

interface ExplainabilityViewProps {
  result?: AnalysisResult | null;
}

function generateHighlightedWords(result: AnalysisResult | null): HighlightedWord[] {
  if (!result || !result.rawText) {
    return [];
  }

  const words = result.rawText.split(/\s+/);
  const keyTermsMap = new Map(result.keyTerms.map(t => [t.term.toLowerCase(), t]));

  return words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-zA-Z0-9\u0900-\u097F\u0C00-\u0C7F]/g, '');
    const termMatch = keyTermsMap.get(cleanWord);
    
    if (termMatch) {
      return {
        text: word,
        impact: termMatch.impact,
        isHighlighted: true,
      };
    }
    return { text: word, impact: 0, isHighlighted: false };
  });
}

function generateExplanations(result: AnalysisResult | null) {
  if (!result) return [];
  
  return result.keyTerms
    .filter(t => t.isNegative && t.impact > 0.3)
    .slice(0, 4)
    .map(term => ({
      term: term.term,
      impact: term.impact,
      reason: getExplanationReason(term.term),
    }));
}

function getExplanationReason(term: string): string {
  const reasons: Record<string, string> = {
    hate: 'Direct expression of animosity or hostility towards individuals or groups',
    kill: 'Violent terminology suggesting intent to cause harm',
    die: 'Language associated with death threats or violent wishes',
    stupid: 'Derogatory language used to demean intelligence',
    idiot: 'Insulting terminology targeting cognitive abilities',
    ugly: 'Appearance-based discriminatory language',
    disgusting: 'Strong negative descriptor often used in dehumanizing contexts',
    worst: 'Extreme negative comparison often preceding discriminatory statements',
    attack: 'Aggressive terminology suggesting violent action',
    fight: 'Confrontational language that may indicate violent intent',
    destroy: 'Language implying elimination or severe harm',
    hurt: 'Terminology suggesting intent to cause pain or suffering',
    harm: 'Direct reference to causing damage or injury',
    beat: 'Violent action terminology',
    punch: 'Physical violence reference',
  };
  
  return reasons[term.toLowerCase()] || 
    'This term has been identified as a potential indicator of harmful content based on linguistic patterns.';
}

export function ExplainabilityView({ result }: ExplainabilityViewProps) {
  const highlightedWords = generateHighlightedWords(result || null);
  const explanations = generateExplanations(result || null);
  const hasContent = result && result.rawText;

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
        <div className="p-4 rounded-xl bg-muted/30 leading-relaxed min-h-[120px]">
          {hasContent ? (
            highlightedWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={cn(
                  "inline-block mr-1 px-1 py-0.5 rounded transition-all",
                  word.isHighlighted && word.impact > 0.7 && "bg-severity-high/40 text-severity-high",
                  word.isHighlighted && word.impact > 0.4 && word.impact <= 0.7 && "bg-severity-medium/40 text-severity-medium",
                  word.isHighlighted && word.impact > 0.1 && word.impact <= 0.4 && "bg-primary/30 text-primary",
                  !word.isHighlighted && "text-foreground"
                )}
                style={{
                  textShadow: word.impact > 0.7 ? '0 0 10px hsl(var(--severity-high) / 0.5)' : undefined
                }}
              >
                {word.text}
              </motion.span>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Info className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                Run an analysis first to see word-level explanations
              </p>
            </div>
          )}
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
          {hasContent 
            ? 'The model identified several linguistic markers that correlate with hate speech patterns.'
            : 'Complete an analysis to see detailed explanations of the prediction.'}
        </p>

        <div className="space-y-4">
          {explanations.length > 0 ? (
            explanations.map((exp, i) => (
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
                      exp.impact > 0.7 ? "bg-severity-high/10 text-severity-high" : "bg-severity-medium/10 text-severity-medium"
                    )}>
                      {Math.round(exp.impact * 100)}% impact
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{exp.reason}</p>
              </motion.div>
            ))
          ) : (
            <div className="p-6 rounded-xl bg-muted/20 text-center">
              <p className="text-muted-foreground text-sm">
                No significant hate indicators detected or analysis not yet performed.
              </p>
            </div>
          )}
        </div>

        {/* Model Info */}
        <div className="mt-6 p-4 rounded-xl border border-border bg-card/50">
          <p className="text-xs text-muted-foreground">
            <span className="text-foreground font-medium">Model:</span> Transformer-based multilingual classifier
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-foreground font-medium">Explainability:</span> LIME with keyword impact analysis
          </p>
        </div>
      </motion.div>
    </div>
  );
}
