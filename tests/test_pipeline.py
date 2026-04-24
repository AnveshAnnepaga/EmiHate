import requests
import io
import json
from PIL import Image, ImageDraw
import docx
from reportlab.pdfgen import canvas

BASE_URL = "http://127.0.0.1:8000"

def create_dummy_image() -> bytes:
    """Generates an image strictly inside VRAM/RAM containing dummy text."""
    img = Image.new('RGB', (450, 100), color = (255, 255, 255))
    d = ImageDraw.Draw(img)
    # Black text on white backgnd increases OCR capability significantly
    d.text((20,40), "WARNING: Destroying property is absolutely mandatory.", fill=(0,0,0))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

def create_dummy_pdf() -> bytes:
    """Generates a minimalistic PDF byte stream entirely virtually."""
    packet = io.BytesIO()
    can = canvas.Canvas(packet)
    can.drawString(50, 800, "Kill them all immediately.")
    can.save()
    packet.seek(0)
    return packet.getvalue()

def create_dummy_docx() -> bytes:
    """Generates a raw Word byte stream structurally."""
    doc = docx.Document()
    doc.add_paragraph("You are a terrible person and you should delete your account.")
    file_stream = io.BytesIO()
    doc.save(file_stream)
    return file_stream.getvalue()

def test_api():
    print(f"{'='*50}")
    print("Beginning Automated Headless Multi-Modal Checkpoints")
    print(f"{'='*50}\n")
    
    # 1. TEXT EVALUATION
    try:
        print("[TEST 1/4] Injecting JSON payload directly to /analyze/text")
        payload = {"text": "I absolutely despise the terrible architecture you constructed! Hate this!"} # Natural langdetect handles it 
        res = requests.post(f"{BASE_URL}/analyze/text", json=payload)
        print("-> Status Code:", res.status_code)
        print("-> Response Dump:", json.dumps(res.json(), indent=2))
        print("\n")
    except Exception as e:
        print(f"-> Failed to construct connection to /analyze/text: {e}")

    # 2. IMAGE OCR EVALUATION
    try:
        print("[TEST 2/4] Generating pure memory image -> EasyOCR POST /analyze/image")
        img_bytes = create_dummy_image()
        files = {'file': ('dummy.png', img_bytes, 'image/png')}
        res = requests.post(f"{BASE_URL}/analyze/image", files=files)
        print("-> Status Code:", res.status_code)
        print("-> Response Dump:", json.dumps(res.json(), indent=2))
        print("\n")
    except Exception as e:
         print(f"-> Failed to construct connection to /analyze/image: {e}")

    # 3. PDF MINER EVALUATION
    try:
        print("[TEST 3/4] Generating PDF Binary Blob -> PyPDF2 POST /analyze/pdf")
        pdf_bytes = create_dummy_pdf()
        files = {'file': ('dummy.pdf', pdf_bytes, 'application/pdf')}
        res = requests.post(f"{BASE_URL}/analyze/pdf", files=files)
        print("-> Status Code:", res.status_code)
        print("-> Response Dump:", json.dumps(res.json(), indent=2))
        print("\n")
    except Exception as e:
         print(f"-> Failed to construct connection to /analyze/pdf: {e}")

    # 4. DOCX FORMATTING EVALUATION
    try:
        print("[TEST 4/4] Generating XML Microsoft Word Blob -> python-docx POST /analyze/docx")
        docx_bytes = create_dummy_docx()
        files = {'file': ('dummy.docx', docx_bytes, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
        res = requests.post(f"{BASE_URL}/analyze/docx", files=files)
        print("-> Status Code:", res.status_code)
        print("-> Response Dump:", json.dumps(res.json(), indent=2))
        print("\n")
    except Exception as e:
         print(f"-> Failed to construct connection to /analyze/docx: {e}")

if __name__ == "__main__":
    print(">>> CRITICAL WARNING: To witness this success, ensure you run Phase 3's backend via:")
    print(">>> `call venv\\Scripts\\activate`")
    print(">>> `python api/main.py`\n")
    test_api()
