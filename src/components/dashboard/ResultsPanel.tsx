import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Smile, TrendingUp, Globe, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisResult } from '@/lib/analysisEngine';

interface ResultsPanelProps {
  result: AnalysisResult;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  const getRiskLevel = (risk: number): string => {
    if (risk > 0.7) return 'High Risk';
    if (risk > 0.4) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = (risk: number): string => {
    if (risk > 0.7) return 'text-severity-high';
    if (risk > 0.4) return 'text-severity-medium';
    return 'text-severity-low';
  };

  return (
    <div className="space-y-6">
      {/* Analysis Meta Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {result.inputName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{result.language}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {result.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              result.overallRisk > 0.7 ? "bg-severity-high/10" : 
              result.overallRisk > 0.4 ? "bg-severity-medium/10" : "bg-severity-low/10"
            )}>
              <AlertTriangle className={cn(
                "w-5 h-5",
                getRiskColor(result.overallRisk)
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Risk Assessment</h3>
              <p className="text-xs text-muted-foreground">Overall threat level</p>
            </div>
          </div>
          <div className="text-right">
            <span className={cn("text-3xl font-bold", getRiskColor(result.overallRisk))}>
              {Math.round(result.overallRisk * 100)}%
            </span>
            <p className={cn("text-xs", getRiskColor(result.overallRisk))}>
              {getRiskLevel(result.overallRisk)}
            </p>
          </div>
        </div>
        
        <div className="confidence-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.overallRisk * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="confidence-fill"
            style={{
              background: result.overallRisk > 0.7 
                ? 'hsl(var(--severity-high))' 
                : result.overallRisk > 0.4 
                  ? 'hsl(var(--severity-medium))' 
                  : 'hsl(var(--severity-low))'
            }}
          />
        </div>
      </motion.div>

      {/* Hate Labels */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Classification Results</h3>
            <p className="text-xs text-muted-foreground">Multilabel detection</p>
          </div>
        </div>

        <div className="space-y-3">
          {result.hateLabels.map((label, i) => (
            <motion.div
              key={label.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  label.severity === 'high' && "bg-severity-high",
                  label.severity === 'medium' && "bg-severity-medium",
                  label.severity === 'low' && "bg-severity-low"
                )} />
                <span className="text-sm text-foreground">{label.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 confidence-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${label.confidence * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                    className="confidence-fill"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {Math.round(label.confidence * 100)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Sentiment Analysis</h3>
            <p className="text-xs text-muted-foreground">Polarity detection</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium",
              result.sentiment.polarity === 'negative' && "bg-severity-high/10 text-severity-high",
              result.sentiment.polarity === 'positive' && "bg-severity-low/10 text-severity-low",
              result.sentiment.polarity === 'neutral' && "bg-muted text-muted-foreground"
            )}>
              {result.sentiment.polarity.charAt(0).toUpperCase() + result.sentiment.polarity.slice(1)}
            </span>
          </div>
          <span className="text-2xl font-bold text-foreground">
            {Math.round(result.sentiment.score * 100)}%
          </span>
        </div>
      </motion.div>

      {/* Emotions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emotion-joy/10 flex items-center justify-center">
            <Smile className="w-5 h-5 text-emotion-joy" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detected Emotions</h3>
            <p className="text-xs text-muted-foreground">Emoji-based recognition</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {result.emotions.map((emotion, i) => (
            <motion.div
              key={emotion.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="emotion-badge hover-lift cursor-default"
            >
              <span className="text-lg">{emotion.emoji}</span>
              <span>{emotion.label}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round(emotion.score * 100)}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key Terms */}
      {result.keyTerms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="font-semibold text-foreground mb-3">Key Influencing Terms</h3>
          <div className="flex flex-wrap gap-2">
            {result.keyTerms.map((term, i) => (
              <motion.span
                key={term.term}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.03 }}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  term.isNegative 
                    ? "bg-severity-high/10 text-severity-high border border-severity-high/20" 
                    : "bg-severity-low/10 text-severity-low border border-severity-low/20"
                )}
              >
                {term.term}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
