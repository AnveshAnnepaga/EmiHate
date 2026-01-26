// Simulated AI Analysis Engine
// Provides realistic analysis results based on content keywords

export interface AnalysisResult {
  id: string;
  timestamp: Date;
  inputType: 'text' | 'image' | 'pdf';
  inputName: string;
  language: string;
  hateLabels: { label: string; confidence: number; severity: 'low' | 'medium' | 'high' }[];
  sentiment: { polarity: 'positive' | 'negative' | 'neutral'; score: number };
  emotions: { emoji: string; label: string; score: number }[];
  overallRisk: number;
  keyTerms: { term: string; impact: number; isNegative: boolean }[];
  rawText: string;
}

// Keyword-based detection patterns
const HATE_PATTERNS = {
  religious: ['religion', 'faith', 'god', 'muslim', 'hindu', 'christian', 'temple', 'church', 'mosque'],
  racial: ['race', 'color', 'ethnic', 'black', 'white', 'asian', 'skin'],
  gender: ['woman', 'man', 'female', 'male', 'gender', 'feminist'],
  offensive: ['hate', 'kill', 'die', 'stupid', 'idiot', 'dumb', 'ugly', 'disgusting', 'worst'],
  violence: ['attack', 'fight', 'destroy', 'hurt', 'harm', 'beat', 'punch'],
};

const POSITIVE_WORDS = ['love', 'great', 'good', 'amazing', 'wonderful', 'beautiful', 'happy', 'joy', 'peace', 'kind', 'help', 'support', 'friend', 'together'];
const NEGATIVE_WORDS = ['hate', 'bad', 'terrible', 'awful', 'horrible', 'sad', 'angry', 'fear', 'alone', 'pain', 'hurt', 'wrong', 'never', 'worst'];

const EMOTIONS = [
  { emoji: '😠', label: 'Anger', keywords: ['hate', 'angry', 'mad', 'furious', 'rage', 'annoyed'] },
  { emoji: '😢', label: 'Sadness', keywords: ['sad', 'cry', 'depressed', 'unhappy', 'lonely', 'pain'] },
  { emoji: '😨', label: 'Fear', keywords: ['scared', 'afraid', 'fear', 'terrified', 'worried', 'anxious'] },
  { emoji: '😊', label: 'Joy', keywords: ['happy', 'joy', 'love', 'excited', 'glad', 'cheerful'] },
  { emoji: '😤', label: 'Frustration', keywords: ['frustrat', 'annoyed', 'irritat', 'stuck', 'why'] },
  { emoji: '🤢', label: 'Disgust', keywords: ['disgust', 'gross', 'nasty', 'sick', 'vile'] },
  { emoji: '😮', label: 'Surprise', keywords: ['wow', 'amazing', 'shock', 'surprised', 'unexpected'] },
];

// Language detection patterns
const HINDI_CHARS = /[\u0900-\u097F]/;
const TELUGU_CHARS = /[\u0C00-\u0C7F]/;

function detectLanguage(text: string): string {
  if (TELUGU_CHARS.test(text)) return 'Telugu';
  if (HINDI_CHARS.test(text)) return 'Hindi';
  return 'English';
}

function countPatternMatches(text: string, patterns: string[]): number {
  const lowerText = text.toLowerCase();
  return patterns.filter(pattern => lowerText.includes(pattern)).length;
}

function findMatchingTerms(text: string, patterns: string[]): string[] {
  const lowerText = text.toLowerCase();
  return patterns.filter(pattern => lowerText.includes(pattern));
}

export function analyzeContent(text: string, inputType: 'text' | 'image' | 'pdf', inputName: string): AnalysisResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Detect language
  const language = detectLanguage(text);
  
  // Calculate hate label scores
  const hateLabels: AnalysisResult['hateLabels'] = [];
  
  const religiousScore = countPatternMatches(text, HATE_PATTERNS.religious);
  const racialScore = countPatternMatches(text, HATE_PATTERNS.racial);
  const genderScore = countPatternMatches(text, HATE_PATTERNS.gender);
  const offensiveScore = countPatternMatches(text, HATE_PATTERNS.offensive);
  const violenceScore = countPatternMatches(text, HATE_PATTERNS.violence);
  
  const totalNegative = countPatternMatches(text, NEGATIVE_WORDS);
  
  if (religiousScore > 0 && totalNegative > 0) {
    const confidence = Math.min(0.95, 0.3 + religiousScore * 0.15 + totalNegative * 0.1);
    hateLabels.push({
      label: 'Religious Hate',
      confidence,
      severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
    });
  }
  
  if (racialScore > 0 && totalNegative > 0) {
    const confidence = Math.min(0.95, 0.3 + racialScore * 0.15 + totalNegative * 0.1);
    hateLabels.push({
      label: 'Racial Discrimination',
      confidence,
      severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
    });
  }
  
  if (genderScore > 0 && totalNegative > 0) {
    const confidence = Math.min(0.92, 0.25 + genderScore * 0.15 + totalNegative * 0.1);
    hateLabels.push({
      label: 'Gender-Based Hate',
      confidence,
      severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
    });
  }
  
  if (offensiveScore > 0) {
    const confidence = Math.min(0.9, 0.2 + offensiveScore * 0.2);
    hateLabels.push({
      label: 'Offensive Language',
      confidence,
      severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
    });
  }
  
  if (violenceScore > 0) {
    const confidence = Math.min(0.95, 0.35 + violenceScore * 0.2);
    hateLabels.push({
      label: 'Violence/Threat',
      confidence,
      severity: confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low',
    });
  }
  
  // If no hate detected, add neutral label
  if (hateLabels.length === 0) {
    hateLabels.push({
      label: 'Neutral Content',
      confidence: 0.85 + Math.random() * 0.1,
      severity: 'low',
    });
  }
  
  // Sort by confidence
  hateLabels.sort((a, b) => b.confidence - a.confidence);
  
  // Calculate sentiment
  const positiveCount = countPatternMatches(text, POSITIVE_WORDS);
  const negativeCount = totalNegative;
  
  let polarity: 'positive' | 'negative' | 'neutral';
  let sentimentScore: number;
  
  if (positiveCount > negativeCount * 1.5) {
    polarity = 'positive';
    sentimentScore = Math.min(0.95, 0.5 + positiveCount * 0.1);
  } else if (negativeCount > positiveCount * 1.5) {
    polarity = 'negative';
    sentimentScore = Math.min(0.95, 0.5 + negativeCount * 0.1);
  } else {
    polarity = 'neutral';
    sentimentScore = 0.5 + Math.random() * 0.2;
  }
  
  // Detect emotions
  const emotions: AnalysisResult['emotions'] = [];
  
  for (const emotion of EMOTIONS) {
    const matchCount = emotion.keywords.filter(kw => lowerText.includes(kw)).length;
    if (matchCount > 0) {
      emotions.push({
        emoji: emotion.emoji,
        label: emotion.label,
        score: Math.min(0.95, 0.3 + matchCount * 0.2),
      });
    }
  }
  
  // Add default emotions if none detected
  if (emotions.length === 0) {
    if (polarity === 'positive') {
      emotions.push({ emoji: '😊', label: 'Joy', score: 0.6 + Math.random() * 0.2 });
    } else if (polarity === 'negative') {
      emotions.push({ emoji: '😐', label: 'Neutral', score: 0.5 + Math.random() * 0.2 });
    } else {
      emotions.push({ emoji: '😐', label: 'Neutral', score: 0.7 + Math.random() * 0.15 });
    }
  }
  
  // Sort emotions by score
  emotions.sort((a, b) => b.score - a.score);
  
  // Calculate overall risk
  const maxHateScore = hateLabels.length > 0 ? Math.max(...hateLabels.map(h => h.confidence)) : 0;
  const hasHighSeverity = hateLabels.some(h => h.severity === 'high');
  
  let overallRisk = maxHateScore * 0.6 + (polarity === 'negative' ? 0.3 : 0) + (hasHighSeverity ? 0.1 : 0);
  overallRisk = Math.min(0.95, Math.max(0.05, overallRisk));
  
  // If neutral content, lower risk significantly
  if (hateLabels[0]?.label === 'Neutral Content') {
    overallRisk = 0.1 + Math.random() * 0.1;
  }
  
  // Extract key terms
  const keyTerms: AnalysisResult['keyTerms'] = [];
  
  // Add negative matched terms
  const allNegativePatterns = [...HATE_PATTERNS.religious, ...HATE_PATTERNS.racial, ...HATE_PATTERNS.gender, ...HATE_PATTERNS.offensive, ...HATE_PATTERNS.violence, ...NEGATIVE_WORDS];
  const matchedNegative = findMatchingTerms(text, allNegativePatterns);
  
  for (const term of matchedNegative.slice(0, 5)) {
    keyTerms.push({
      term,
      impact: 0.5 + Math.random() * 0.4,
      isNegative: true,
    });
  }
  
  // Add some positive terms
  const matchedPositive = findMatchingTerms(text, POSITIVE_WORDS);
  for (const term of matchedPositive.slice(0, 3)) {
    keyTerms.push({
      term,
      impact: 0.3 + Math.random() * 0.3,
      isNegative: false,
    });
  }
  
  // Sort by impact
  keyTerms.sort((a, b) => b.impact - a.impact);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date(),
    inputType,
    inputName,
    language,
    hateLabels,
    sentiment: { polarity, score: sentimentScore },
    emotions: emotions.slice(0, 4),
    overallRisk,
    keyTerms: keyTerms.slice(0, 6),
    rawText: text.slice(0, 500),
  };
}

// Storage for analysis history
const HISTORY_STORAGE_KEY = 'hateintel_analysis_history';

export function saveAnalysisResult(result: AnalysisResult): void {
  const history = getAnalysisHistory();
  history.unshift(result);
  // Keep only last 50 results
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
}

export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const data = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
  } catch {
    return [];
  }
}

export function clearAnalysisHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}
