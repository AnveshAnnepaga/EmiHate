import { motion } from 'framer-motion';
import { ArrowRight, Brain, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NeuralOrb } from '@/components/3d/NeuralOrb';
import heroBg from '@/assets/hero-bg.jpg';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image fallback */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      {/* 3D Neural Orb */}
      <NeuralOrb />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">
              AI-Powered Multilingual Analysis
            </span>
          </motion.div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-foreground">Multimodal</span>
            <br />
            <span className="gradient-text glow-text">Emotion-Aware</span>
            <br />
            <span className="text-foreground">Hate Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Advanced AI system that analyzes text, images, and documents across 
            English, Hindi, and Telugu to detect hate speech with emotional context 
            and explainable insights.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              size="lg" 
              className="group glow-primary"
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Analysis
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-muted hover:bg-muted/50"
              onClick={() => window.open('https://github.com', '_blank')}
            >
              View Documentation
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={Globe}
            title="Multilingual"
            description="English, Hindi, and Telugu support with transformer-based models"
            delay={0}
          />
          <FeatureCard
            icon={Brain}
            title="Multimodal"
            description="Analyze text, images, and PDFs with OCR integration"
            delay={0.1}
          />
          <FeatureCard
            icon={Shield}
            title="Explainable AI"
            description="LIME & SHAP visualizations for transparent predictions"
            delay={0.2}
          />
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 + delay }}
      className="glass-card p-6 hover-lift cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
