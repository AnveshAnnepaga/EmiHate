import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Globe } from 'lucide-react';
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

const trendData = [
  { date: 'Jan', hate: 120, offensive: 80, neutral: 200 },
  { date: 'Feb', hate: 150, offensive: 100, neutral: 180 },
  { date: 'Mar', hate: 90, offensive: 60, neutral: 220 },
  { date: 'Apr', hate: 180, offensive: 120, neutral: 150 },
  { date: 'May', hate: 140, offensive: 90, neutral: 190 },
  { date: 'Jun', hate: 200, offensive: 140, neutral: 160 },
];

const emotionData = [
  { name: 'Anger', value: 35, color: 'hsl(0, 84%, 60%)' },
  { name: 'Fear', value: 25, color: 'hsl(263, 70%, 50%)' },
  { name: 'Sadness', value: 20, color: 'hsl(210, 100%, 56%)' },
  { name: 'Disgust', value: 12, color: 'hsl(142, 76%, 36%)' },
  { name: 'Surprise', value: 8, color: 'hsl(38, 92%, 50%)' },
];

const languageData = [
  { language: 'English', count: 1250 },
  { language: 'Hindi', count: 890 },
  { language: 'Telugu', count: 560 },
];

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
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
          </div>

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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
