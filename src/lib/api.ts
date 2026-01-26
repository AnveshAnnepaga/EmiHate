/**
 * API Service Layer for HateIntel
 * 
 * This file defines all API endpoints that the frontend uses.
 * Replace the BASE_URL with your Flask/Spring Boot backend URL.
 * 
 * ENDPOINTS:
 * 
 * 1. POST /api/analyze/text
 *    - Analyzes text content for hate speech, sentiment, and emotions
 *    - Request: { text: string, language?: string }
 *    - Response: AnalysisResult
 * 
 * 2. POST /api/analyze/file
 *    - Analyzes uploaded file (image/PDF) for hate speech
 *    - Request: FormData with 'file' field
 *    - Response: AnalysisResult
 * 
 * 3. GET /api/history
 *    - Retrieves analysis history for the user
 *    - Response: AnalysisResult[]
 * 
 * 4. DELETE /api/history
 *    - Clears analysis history
 *    - Response: { success: boolean }
 * 
 * 5. GET /api/health
 *    - Health check endpoint
 *    - Response: { status: 'ok', version: string }
 */

import { AnalysisResult } from './analysisEngine';

// ============================================
// CONFIGURATION - Update this for your backend
// ============================================

// Set this to your Flask/Spring Boot backend URL
// Examples:
//   Flask: 'http://localhost:5000'
//   Spring Boot: 'http://localhost:8080'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Set to true when backend is ready
export const USE_BACKEND = false;

// ============================================
// API TYPES - Use these in your backend
// ============================================

export interface AnalyzeTextRequest {
  text: string;
  language?: 'en' | 'hi' | 'te' | 'auto';
}

export interface AnalyzeFileRequest {
  file: File;
  fileType: 'image' | 'pdf' | 'text';
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: AnalysisResult[];
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'error';
  version: string;
  timestamp: string;
}

// ============================================
// API ENDPOINTS
// ============================================

/**
 * POST /api/analyze/text
 * 
 * Analyze text content for hate speech detection
 * 
 * @param request - The text analysis request
 * @returns Promise<AnalysisResponse>
 * 
 * Backend Implementation (Flask example):
 * ```python
 * @app.route('/api/analyze/text', methods=['POST'])
 * def analyze_text():
 *     data = request.get_json()
 *     text = data.get('text')
 *     language = data.get('language', 'auto')
 *     
 *     # Your ML model inference here
 *     result = model.predict(text, language)
 *     
 *     return jsonify({
 *         'success': True,
 *         'data': result
 *     })
 * ```
 * 
 * Backend Implementation (Spring Boot example):
 * ```java
 * @PostMapping("/api/analyze/text")
 * public ResponseEntity<AnalysisResponse> analyzeText(@RequestBody AnalyzeTextRequest request) {
 *     AnalysisResult result = analysisService.analyze(request.getText(), request.getLanguage());
 *     return ResponseEntity.ok(new AnalysisResponse(true, result, null));
 * }
 * ```
 */
export async function analyzeText(request: AnalyzeTextRequest): Promise<AnalysisResponse> {
  if (!USE_BACKEND) {
    // Return mock - replace with real API call when backend is ready
    const { analyzeContent } = await import('./analysisEngine');
    const result = analyzeContent(request.text, 'text', 'Direct Text Input');
    return { success: true, data: result };
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
  }

  return response.json();
}

/**
 * POST /api/analyze/file
 * 
 * Analyze uploaded file (image, PDF, or text file)
 * 
 * @param request - The file analysis request
 * @returns Promise<AnalysisResponse>
 * 
 * Backend Implementation (Flask example):
 * ```python
 * @app.route('/api/analyze/file', methods=['POST'])
 * def analyze_file():
 *     file = request.files.get('file')
 *     file_type = request.form.get('fileType')
 *     
 *     # Extract text from file (OCR for images, parse for PDF)
 *     text = extract_text(file, file_type)
 *     
 *     # Your ML model inference here
 *     result = model.predict(text)
 *     
 *     return jsonify({
 *         'success': True,
 *         'data': result
 *     })
 * ```
 * 
 * Backend Implementation (Spring Boot example):
 * ```java
 * @PostMapping("/api/analyze/file")
 * public ResponseEntity<AnalysisResponse> analyzeFile(
 *     @RequestParam("file") MultipartFile file,
 *     @RequestParam("fileType") String fileType
 * ) {
 *     String text = textExtractor.extract(file, fileType);
 *     AnalysisResult result = analysisService.analyze(text);
 *     return ResponseEntity.ok(new AnalysisResponse(true, result, null));
 * }
 * ```
 */
export async function analyzeFile(request: AnalyzeFileRequest): Promise<AnalysisResponse> {
  if (!USE_BACKEND) {
    // Return mock - replace with real API call when backend is ready
    const { analyzeContent } = await import('./analysisEngine');
    const result = analyzeContent(
      `[Content from ${request.file.name}]`,
      request.fileType,
      request.file.name
    );
    return { success: true, data: result };
  }

  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('fileType', request.fileType);

  const response = await fetch(`${API_BASE_URL}/api/analyze/file`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
  }

  return response.json();
}

/**
 * GET /api/history
 * 
 * Get analysis history
 * 
 * @returns Promise<HistoryResponse>
 * 
 * Backend Implementation (Flask example):
 * ```python
 * @app.route('/api/history', methods=['GET'])
 * def get_history():
 *     user_id = get_current_user_id()
 *     history = db.query(AnalysisHistory).filter_by(user_id=user_id).all()
 *     return jsonify({
 *         'success': True,
 *         'data': [h.to_dict() for h in history]
 *     })
 * ```
 */
export async function getHistory(): Promise<HistoryResponse> {
  if (!USE_BACKEND) {
    const { getAnalysisHistory } = await import('./analysisEngine');
    return { success: true, data: getAnalysisHistory() };
  }

  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
  }

  return response.json();
}

/**
 * DELETE /api/history
 * 
 * Clear analysis history
 * 
 * @returns Promise<{ success: boolean; error?: string }>
 * 
 * Backend Implementation (Flask example):
 * ```python
 * @app.route('/api/history', methods=['DELETE'])
 * def clear_history():
 *     user_id = get_current_user_id()
 *     db.query(AnalysisHistory).filter_by(user_id=user_id).delete()
 *     db.commit()
 *     return jsonify({ 'success': True })
 * ```
 */
export async function clearHistory(): Promise<{ success: boolean; error?: string }> {
  if (!USE_BACKEND) {
    const { clearAnalysisHistory } = await import('./analysisEngine');
    clearAnalysisHistory();
    return { success: true };
  }

  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
  }

  return response.json();
}

/**
 * GET /api/health
 * 
 * Health check endpoint
 * 
 * @returns Promise<HealthResponse>
 * 
 * Backend Implementation (Flask example):
 * ```python
 * @app.route('/api/health', methods=['GET'])
 * def health_check():
 *     return jsonify({
 *         'status': 'ok',
 *         'version': '1.0.0',
 *         'timestamp': datetime.utcnow().isoformat()
 *     })
 * ```
 */
export async function checkHealth(): Promise<HealthResponse> {
  if (!USE_BACKEND) {
    return {
      status: 'ok',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return { status: 'error', version: 'unknown', timestamp: new Date().toISOString() };
    }

    return response.json();
  } catch {
    return { status: 'error', version: 'unknown', timestamp: new Date().toISOString() };
  }
}

// ============================================
// EXPECTED RESPONSE FORMAT (AnalysisResult)
// ============================================
/**
 * Your backend should return data in this format:
 * 
 * {
 *   "id": "abc123",
 *   "timestamp": "2024-01-26T10:30:00.000Z",
 *   "inputType": "text" | "image" | "pdf",
 *   "inputName": "Direct Text Input",
 *   "language": "English" | "Hindi" | "Telugu",
 *   "hateLabels": [
 *     { "label": "Religious Hate", "confidence": 0.85, "severity": "high" }
 *   ],
 *   "sentiment": { "polarity": "negative", "score": 0.75 },
 *   "emotions": [
 *     { "emoji": "😠", "label": "Anger", "score": 0.8 }
 *   ],
 *   "overallRisk": 0.85,
 *   "keyTerms": [
 *     { "term": "hate", "impact": 0.9, "isNegative": true }
 *   ],
 *   "rawText": "The analyzed text content..."
 * }
 */
