import easyocr
import PyPDF2
import docx
import io
import numpy as np
import torch
from PIL import Image, ImageOps, ImageFilter

USE_GPU = torch.cuda.is_available()
# EasyOCR initialization
reader_hi = easyocr.Reader(['en', 'hi'], gpu=USE_GPU) 
reader_te = easyocr.Reader(['en', 'te'], gpu=USE_GPU) 

def preprocess_image(image: Image.Image) -> Image.Image:
    """Smart-Sync Preprocessing: Adaptive Scaling + Contrast."""
    w, h = image.size
    
    # 1. Intelligence Scaling (Cap max dimensions for speed, Boost small ones for accuracy)
    # ULTRA-RES: Capped at 1800px to provide deep intelligence extraction (Target: ~45s on CPU)
    if w > 1800 or h > 1800:
        scale = 1800 / max(w, h)
        image = image.resize((int(w*scale), int(h*scale)), resample=Image.Resampling.LANCZOS)
    elif w < 800:
        # Boost small screenshots
        image = image.resize((int(w*2.0), int(h*2.0)), resample=Image.Resampling.LANCZOS)
    
    # 2. Grayscale + Aggressive Autocontrast
    image = ImageOps.grayscale(image)
    image = ImageOps.autocontrast(image, cutoff=1)
    
    # 3. Sharpening
    image = image.filter(ImageFilter.SHARPEN)
    
    return image

def clean_ocr_text(text: str) -> str:
    """Removes OCR gibberish, non-text symbols, and formatting noise."""
    import re
    text = re.sub(r'[|\\/_~^`<>+={}*]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

from concurrent.futures import ThreadPoolExecutor

def process_image(image_bytes: bytes) -> str:
    """Extracted text with Smart-Sync Sequential Stability."""
    try:
        raw_io = io.BytesIO(image_bytes)
        with Image.open(raw_io).convert("RGB") as image:
            # Apply Smart-Sync Preprocessing
            processed = preprocess_image(image)
            image_np = np.array(processed)
            
            # High-Speed Sequential (Most Stable for CPU)
            res_hi = reader_hi.readtext(image_np, detail=0)
            res_te = reader_te.readtext(image_np, detail=0)
            
            # Result Merging
            combined = list(res_hi)
            for t in res_te:
                if t not in combined: combined.append(t)
            
            # Cleanup for stability
            processed.close()
            return clean_ocr_text(" ".join(combined))
    except Exception as e:
        print(f"[OCR ERROR] Smart-Sync failed: {e}")
        return ""

def process_pdf(pdf_bytes: bytes) -> str:
    """Uses PyPDF2 natively. Identifies scanned/image-only PDFs."""
    text = ""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted: text += extracted + "\n"
    except Exception as e:
        print(f"[PDF ERROR] Extraction failed: {e}")
        return "[ERROR_READING_PDF]"

    cleaned = clean_ocr_text(text)
    # If no native text was found, it's likely a scanned image inside a PDF
    if not cleaned or len(cleaned) < 5:
        return "[SCANNED_PDF]"
        
    return cleaned

def process_docx(docx_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(docx_bytes))
    text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
    return clean_ocr_text(text)
