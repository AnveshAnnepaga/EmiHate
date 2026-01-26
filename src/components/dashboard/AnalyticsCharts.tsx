import { motion } from 'framer-motion';
import { PieChart, TrendingUp, Globe, RefreshCw } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useState, useEffect } from 'react';
import { getAnalysisHistory, clearAnalysisHistory, AnalysisResult } from '@/lib/analysisEngine';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

function aggregateHistoryData(history: AnalysisResult[]) {
  // Group by date
  const dateGroups: Record<string, { hate: number; offensive: number; neutral: number }> = {};
  
  history.forEach(item => {
    const dateKey = item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!dateGroups[dateKey]) {
      dateGroups[dateKey] = { hate: 0, offensive: 0, neutral: 0 };
    }
    
    if (item.overallRisk > 0.6) {
      dateGroups[dateKey].hate++;
    } else if (item.overallRisk > 0.3) {
      dateGroups[dateKey].offensive++;
    } else {
      dateGroups[dateKey].neutral++;
    }
  });

  return Object.entries(dateGroups)
    .slice(-7)
    .map(([date, counts]) => ({ date, ...counts }));
}

function aggregateEmotionData(history: AnalysisResult[]) {
  const emotionCounts: Record<string, { value: number; color: string }> = {
    'Anger': { value: 0, color: 'hsl(0, 84%, 60%)' },
    'Fear': { value: 0, color: 'hsl(263, 70%, 50%)' },
    'Sadness': { value: 0, color: 'hsl(210, 100%, 56%)' },
    'Joy': { value: 0, color: 'hsl(142, 76%, 36%)' },
    'Frustration': { value: 0, color: 'hsl(38, 92%, 50%)' },
    'Disgust': { value: 0, color: 'hsl(280, 70%, 50%)' },
    'Surprise': { value: 0, color: 'hsl(180, 70%, 50%)' },
    'Neutral': { value: 0, color: 'hsl(220, 20%, 50%)' },
  };

  history.forEach(item => {
    item.emotions.forEach(emotion => {
      if (emotionCounts[emotion.label]) {
        emotionCounts[emotion.label].value++;
      }
    });
  });

  return Object.entries(emotionCounts)
    .filter(([_, data]) => data.value > 0)
    .map(([name, data]) => ({ name, value: data.value, color: data.color }));
}

function aggregateLanguageData(history: AnalysisResult[]) {
  const langCounts: Record<string, number> = { English: 0, Hindi: 0, Telugu: 0 };
  
  history.forEach(item => {
    if (langCounts[item.language] !== undefined) {
      langCounts[item.language]++;
    }
  });

  return Object.entries(langCounts)
    .filter(([_, count]) => count > 0)
    .map(([language, count]) => ({ language, count }));
}

export function AnalyticsCharts() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  const trendData = aggregateHistoryData(history);
  const emotionData = aggregateEmotionData(history);
  const languageData = aggregateLanguageData(history);

  const handleClearHistory = () => {
    clearAnalysisHistory();
    setHistory([]);
    toast({
      title: 'History Cleared',
      description: 'All analysis history has been removed.',
    });
  };

  const hasData = history.length > 0;

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="text-sm text-muted-foreground">
          {hasData ? (
            <>Total analyses: <span className="text-foreground font-medium">{history.length}</span></>
          ) : (
            'No analysis history yet. Run some analyses to see trends.'
          )}
        </div>
        {hasData && (
          <Button variant="ghost" size="sm" onClick={handleClearHistory} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Clear History
          </Button>
        )}
      </motion.div>

      {/* Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Detection Trends</h3>
              <p className="text-xs text-muted-foreground">Content classification over time</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-high" />
              <span className="text-muted-foreground">Hate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-medium" />
              <span className="text-muted-foreground">Offensive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-severity-low" />
              <span className="text-muted-foreground">Neutral</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="hateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="offensiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="neutralGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                <XAxis dataKey="date" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(217, 33%, 17%)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
                />
                <Area
                  type="monotone"
                  dataKey="hate"
                  stroke="hsl(0, 84%, 60%)"
                  fillOpacity={1}
                  fill="url(#hateGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="offensive"
                  stroke="hsl(38, 92%, 50%)"
                  fillOpacity={1}
                  fill="url(#offensiveGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="neutral"
                  stroke="hsl(142, 76%, 36%)"
                  fillOpacity={1}
                  fill="url(#neutralGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              No trend data available yet
            </div>
          )}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emotion Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <PieChart className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Emotion Distribution</h3>
              <p className="text-xs text-muted-foreground">Detected emotional signals</p>
            </div>
          </div>

          <div className="h-48 flex items-center justify-center">
            {emotionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={emotionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {emotionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(217, 33%, 17%)',
                      borderRadius: '8px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="text-muted-foreground text-sm">
                No emotion data available
              </div>
            )}
          </div>

          {emotionData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {emotionData.map((emotion) => (
                <div key={emotion.name} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: emotion.color }}
                  />
                  <span className="text-muted-foreground">{emotion.name}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Language Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Language Breakdown</h3>
              <p className="text-xs text-muted-foreground">Content by language</p>
            </div>
          </div>

          <div className="h-48">
            {languageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={languageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
                  <XAxis type="number" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                  <YAxis 
                    dataKey="language" 
                    type="category" 
                    stroke="hsl(215, 20%, 65%)" 
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(222, 47%, 8%)',
                      border: '1px solid hsl(217, 33%, 17%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="url(#barGradient)"
                    radius={[0, 4, 4, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                      <stop offset="100%" stopColor="hsl(263, 70%, 50%)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No language data available
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
