import { motion } from 'framer-motion';
import { AlertTriangle, MessageCircle, Shield, Smile, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  hateLabels: { label: string; confidence: number; severity: 'low' | 'medium' | 'high' }[];
  sentiment: { polarity: 'positive' | 'negative' | 'neutral'; score: number };
  emotions: { emoji: string; label: string; score: number }[];
  language: string;
  overallRisk: number;
}

const mockResult: AnalysisResult = {
  hateLabels: [
    { label: 'Religious Hate', confidence: 0.87, severity: 'high' },
    { label: 'Offensive Language', confidence: 0.72, severity: 'medium' },
    { label: 'Implicit Bias', confidence: 0.45, severity: 'low' },
  ],
  sentiment: { polarity: 'negative', score: 0.78 },
  emotions: [
    { emoji: '😠', label: 'Anger', score: 0.82 },
    { emoji: '😤', label: 'Frustration', score: 0.65 },
    { emoji: '😢', label: 'Sadness', score: 0.23 },
  ],
  language: 'English',
  overallRisk: 0.76,
};

export function ResultsPanel() {
  const result = mockResult;

  return (
    <div className="space-y-6">
      {/* Overall Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-severity-high/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-severity-high" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Risk Assessment</h3>
              <p className="text-xs text-muted-foreground">Overall threat level</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-severity-high">
              {Math.round(result.overallRisk * 100)}%
            </span>
            <p className="text-xs text-severity-high">High Risk</p>
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
            <h3 className="font-semibold text-foreground">Hate Categories</h3>
            <p className="text-xs text-muted-foreground">Multilabel classification</p>
          </div>
        </div>

        <div className="space-y-3">
          {result.hateLabels.map((label, i) => (
            <motion.div
              key={label.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
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
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
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
            <span className="text-sm text-muted-foreground">
              Language: {result.language}
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
              transition={{ delay: 0.4 + i * 0.1 }}
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
    </div>
  );
}
