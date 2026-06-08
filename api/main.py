from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from inference import predict_multi_head, predict_conversation, clean_tweet_text, extract_tweet_metadata
import ocr_service

app = FastAPI(
    title="EmiHate Intelligence Grid",
    description="Backend routing Language -> 9 Heads (Hate, Emotion, Sentiment). Balanced and Calibrated.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str
    explain: bool = False

class ConversationRequest(BaseModel):
    messages: list[str]

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Serve Frontend
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
app.mount("/static", StaticFiles(directory=frontend_path), name="static")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))

@app.post("/api/analyze/text")
async def analyze_text(request: TextRequest):
    result = predict_multi_head(request.text, include_explanations=request.explain)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {"status": "success", "data": result}

@app.post("/api/analyze/tweet")
async def analyze_tweet(request: TextRequest):
    metadata = extract_tweet_metadata(request.text)
    cleaned_text = clean_tweet_text(request.text)
    result = predict_multi_head(cleaned_text)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return {
        "status": "success", 
        "metadata": metadata,
        "original_text": request.text, 
        "cleaned_text": cleaned_text, 
        "data": result
    }

@app.post("/api/analyze/conversation")
async def analyze_conversation_endpoint(request: ConversationRequest):
    # Predict conversation now returns a dict with trend analysis
    result = predict_conversation(request.messages)
    return {"status": "success", "data": result}

@app.post("/api/analyze/image")
async def analyze_image_endpoint(file: UploadFile = File(...), explain: bool = Form(False)):
    try:
        image_bytes = await file.read()
        extracted_text = ocr_service.process_image(image_bytes)
        
        if not extracted_text or len(extracted_text.strip()) < 2:
            return {"status": "error", "message": "EmiHate Extraction: No text found in this image. Ensure it is clear and has text."}
            
        result = predict_multi_head(extracted_text, include_explanations=explain)
        return {"status": "success", "full_text": extracted_text, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image Error: {str(e)}")

@app.post("/api/analyze/pdf")
async def analyze_pdf_endpoint(file: UploadFile = File(...), explain: bool = Form(False)):
    try:
        pdf_bytes = await file.read()
        extracted_text = ocr_service.process_pdf(pdf_bytes)
        
        if extracted_text == "[SCANNED_PDF]":
            return {"status": "error", "message": "EmiHate Analysis: This PDF is a scanned image. Please upload it as a JPG/PNG Image for deep extraction."}
        if extracted_text == "[ERROR_READING_PDF]" or not extracted_text:
            return {"status": "error", "message": "Failed to extract text from this PDF. It may be encrypted."}
            
        result = predict_multi_head(extracted_text, include_explanations=explain)
        return {"status": "success", "full_text": extracted_text, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Error: {str(e)}")

@app.post("/api/analyze/docx")
async def analyze_docx_endpoint(file: UploadFile = File(...), explain: bool = Form(False)):
    try:
        docx_bytes = await file.read()
        extracted_text = ocr_service.process_docx(docx_bytes)
        
        if not extracted_text:
            return {"status": "error", "message": "EmiHate Analysis: No text found in this document."}
            
        result = predict_multi_head(extracted_text, include_explanations=explain)
        return {"status": "success", "full_text": extracted_text, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX Error: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "models_loaded": "EmiHate 9-Head Architecture Online"}

if __name__ == "__main__":
    # --- EmiHate Grid Boot Report ---
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
    
    print("\n" + "="*50)
    print(" EMIHATE NEURAL ARCHITECTURE: ONLINE ")
    print(f" - Core Engine:   Multilingual BERT-9 v4.2")
    print(f" - Grid Status:   {'[READY]' if os.path.exists(frontend_path) else '[MISSING! Check Path]'}")
    print(f" - Grid Port:     7860")
    print("="*50 + "\n")

    if not os.path.exists(frontend_path):
        print(f"[CRITICAL ERROR] The 'frontend' directory was not found at {frontend_path}.")
        print("Please ensure your project structure is: root/api/main.py and root/frontend/index.html")
    
    uvicorn.run(app, host="127.0.0.1", port=7860, log_level="info")
