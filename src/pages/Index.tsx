import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/dashboard/UploadZone';
import { ResultsPanel } from '@/components/dashboard/ResultsPanel';
import { ExplainabilityView } from '@/components/dashboard/ExplainabilityView';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { ProcessingIndicator } from '@/components/dashboard/ProcessingIndicator';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { 
  LayoutDashboard, 
  Lightbulb, 
  BarChart3, 
  Play,
  ArrowDown,
} from 'lucide-react';

type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete';

const Index = () => {
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [hasFiles, setHasFiles] = useState(false);

  const startAnalysis = () => {
    const stages: ProcessingStage[] = ['uploading', 'processing', 'analyzing', 'complete'];
    let i = 0;
    
    setStage(stages[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < stages.length) {
        setStage(stages[i]);
      } else {
        clearInterval(interval);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-muted-foreground">Explore Dashboard</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-5 h-5 text-primary" />
        </motion.div>
      </motion.div>
      
      {/* Dashboard Section */}
      <section id="dashboard" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Analysis <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload content for multilingual hate speech detection with emotion-aware 
              analysis and explainable AI insights.
            </p>
          </motion.div>

          <Tabs defaultValue="analyze" className="space-y-8">
            <TabsList className="glass-card p-1 mx-auto w-fit">
              <TabsTrigger 
                value="analyze" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Analyze
              </TabsTrigger>
              <TabsTrigger 
                value="explain"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Explain
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-4">
                  <UploadZone onFilesChange={(files) => setHasFiles(files.length > 0)} />
                  
                  {hasFiles && stage === 'idle' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Button 
                        size="lg" 
                        className="w-full glow-primary group"
                        onClick={startAnalysis}
                      >
                        <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Start Analysis
                      </Button>
                    </motion.div>
                  )}

                  {stage !== 'idle' && <ProcessingIndicator stage={stage} />}
                </div>

                {/* Results Section */}
                <div>
                  {stage === 'complete' ? (
                    <ResultsPanel />
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="glass-card p-8 h-full flex flex-col items-center justify-center text-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <LayoutDashboard className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Results will appear here
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload content and start analysis to see hate speech detection, 
                        sentiment, and emotion results.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="explain">
              <ExplainabilityView />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsCharts />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Industrial Mini Project • Emotion-Aware Multimodal System
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>A. Anvesh</span>
              <span>•</span>
              <span>R. Bharath Reddy</span>
              <span>•</span>
              <span>Ch. Damodhar</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
