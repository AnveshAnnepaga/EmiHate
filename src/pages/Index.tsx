import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/dashboard/UploadZone';
import { TextInputZone } from '@/components/dashboard/TextInputZone';
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
  Type,
  Upload,
} from 'lucide-react';
import { analyzeContent, saveAnalysisResult, AnalysisResult } from '@/lib/analysisEngine';
import { useToast } from '@/hooks/use-toast';

type ProcessingStage = 'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete';
type InputMode = 'text' | 'file';

interface UploadedFile {
  id: string;
  name: string;
  type: 'text' | 'image' | 'pdf';
  size: string;
  content?: string;
}

const Index = () => {
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const hasInput = inputMode === 'text' ? textInput.trim().length > 0 : uploadedFiles.length > 0;

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        reader.onload = (e) => resolve(e.target?.result as string || '');
        reader.onerror = reject;
        reader.readAsText(file);
      } else if (file.type.includes('image')) {
        // For images, we simulate OCR with a placeholder
        resolve(`[Image content from: ${file.name}] - OCR extraction would process this image for text content.`);
      } else if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
        // For PDFs, simulate text extraction
        resolve(`[PDF content from: ${file.name}] - Document text extraction would process this PDF.`);
      } else {
        resolve(`[Content from: ${file.name}]`);
      }
    });
  };

  const handleFilesChange = async (files: UploadedFile[], rawFiles?: File[]) => {
    if (rawFiles && rawFiles.length > 0) {
      const filesWithContent = await Promise.all(
        files.map(async (f, i) => {
          const content = rawFiles[i] ? await extractTextFromFile(rawFiles[i]) : '';
          return { ...f, content };
        })
      );
      setUploadedFiles(filesWithContent);
    } else {
      setUploadedFiles(files);
    }
  };

  const startAnalysis = async () => {
    const stages: ProcessingStage[] = ['uploading', 'processing', 'analyzing', 'complete'];
    let stageIndex = 0;
    
    setStage(stages[0]);

    // Get text to analyze
    let textToAnalyze = '';
    let inputName = '';
    let inputType: 'text' | 'image' | 'pdf' = 'text';

    if (inputMode === 'text') {
      textToAnalyze = textInput;
      inputName = 'Direct Text Input';
      inputType = 'text';
    } else if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      textToAnalyze = file.content || `Content from ${file.name}`;
      inputName = file.name;
      inputType = file.type;
    }

    if (!textToAnalyze.trim()) {
      toast({
        title: 'No content to analyze',
        description: 'Please enter text or upload a file first.',
        variant: 'destructive',
      });
      setStage('idle');
      return;
    }

    // Simulate processing stages
    const interval = setInterval(() => {
      stageIndex++;
      if (stageIndex < stages.length) {
        setStage(stages[stageIndex]);
        
        if (stages[stageIndex] === 'complete') {
          // Perform analysis
          const result = analyzeContent(textToAnalyze, inputType, inputName);
          setAnalysisResult(result);
          saveAnalysisResult(result);
          
          toast({
            title: 'Analysis Complete',
            description: `Processed ${inputName} successfully.`,
          });
        }
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const resetAnalysis = () => {
    setStage('idle');
    setAnalysisResult(null);
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
                {/* Input Section */}
                <div className="space-y-4">
                  {/* Input Mode Toggle */}
                  <div className="flex gap-2 p-1 bg-muted/30 rounded-xl w-fit">
                    <button
                      onClick={() => setInputMode('text')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        inputMode === 'text' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Type className="w-4 h-4" />
                      Text Input
                    </button>
                    <button
                      onClick={() => setInputMode('file')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        inputMode === 'file' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      File Upload
                    </button>
                  </div>

                  {/* Input Zone */}
                  {inputMode === 'text' ? (
                    <TextInputZone value={textInput} onChange={setTextInput} />
                  ) : (
                    <UploadZone onFilesChange={handleFilesChange} />
                  )}
                  
                  {hasInput && stage === 'idle' && (
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

                  {stage !== 'idle' && stage !== 'complete' && (
                    <ProcessingIndicator stage={stage} />
                  )}

                  {stage === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full"
                        onClick={resetAnalysis}
                      >
                        Analyze New Content
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Results Section */}
                <div>
                  {stage === 'complete' && analysisResult ? (
                    <ResultsPanel result={analysisResult} />
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
                        Enter text or upload content and start analysis to see hate speech detection, 
                        sentiment, and emotion results.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="explain">
              <ExplainabilityView result={analysisResult} />
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
            <p className="text-sm text-muted-foreground">
              Multilingual Hate Speech Detection Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
