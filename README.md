# 🛡️ EmiHate Intelligence Grid

**Multilingual | Explainable | Neural Grid**

EmiHate is a production-grade, deep-learning powered engine designed for detecting hate speech, toxicity, and sentiment across multiple languages (English, Hindi, Telugu). It utilizes a sophisticated **9-Head Neural Architecture** and provides real-time **Explainable AI (XAI)** insights using SHAP and LIME to show *why* a model made a specific decision.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005863?style=for-the-badge&logo=fastapi&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

---

## 🚀 Key Features

*   **🌍 Multilingual Support**: Deep detection for English, Hindi, and Telugu.
*   **🧠 9-Head Neural Engine**: Analyzes Hate, Emotion, and Sentiment simultaneously for balanced classification.
*   **🔍 Explainable AI (XAI)**: Integrated SHAP & LIME visualizations for word-level importance and global calibration.
*   **📸 Multimodal OCR**: Process images (JPG/PNG) and PDFs to detect hate speech in visual content using EasyOCR.
*   **📈 Conversation Trends**: Analyzes message threads to detect escalating toxicity or de-escalating tension.
*   **🐳 Production Ready**: Fully containerized with Docker and Docker Compose.

---

## 🛠️ Tech Stack

*   **Backend**: FastAPI, Uvicorn, Python 3.10
*   **Deep Learning**: PyTorch, Transformers (HuggingFace), BERT-based models
*   **OCR**: EasyOCR, PyPDF2
*   **XAI**: LIME, SHAP
*   **Frontend**: Vanilla JS, CSS3, HTML5 (Served via FastAPI)
*   **DevOps**: Docker, Docker Compose

---

## 📦 Project Structure

```text
root/
├── api/                # Backend FastAPI application
│   ├── main.py         # Entry point & routing
│   ├── inference.py    # Neural Grid logic (9-Head Engine)
│   └── ocr_service.py  # Image & PDF extraction
├── frontend/           # Dashboard UI
├── models/             # Pre-trained model weights (Ignored in Git)
├── Dockerfile          # Production container build
└── docker-compose.yml  # Orchestration & Volume setup
```

---

## 🚦 Quick Start

### 1. Prerequisite: Models
Ensure your pre-trained models are placed in the `models/` directory following the naming convention: `{language}_{task}_best_model`.

### 2. Run with Docker (Recommended)
```bash
docker-compose up -d --build
```
The application will be available at `http://localhost:5051`.

### 3. Local Development
```bash
# Setup Environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install Dependencies
pip install -r requirements.txt

# Start Server
uvicorn api.main:app --host 127.0.0.1 --port 5051 --reload
```

---

## 📡 API Documentation

*   `POST /api/analyze/text`: Analyze raw text.
*   `POST /api/analyze/image`: Analyze text extracted from an image.
*   `POST /api/analyze/pdf`: Analyze text from a PDF.
*   `POST /api/analyze/conversation`: Analyze a thread for toxicity trends.
*   `GET /api/health`: Check neural engine status.

---

## 🛡️ Security & Best Practices

*   **Non-Root Execution**: Docker container runs as a non-privileged `appuser`.
*   **Multi-Stage Build**: Minimized attack surface and image size.
*   **CORS Enabled**: Configured for secure frontend-backend communication.

---

## 🤝 Team Roles
*   **Member 1**: RoBERTa Architecture & DevOps Pipelines
*   **Member 2**: Telugu Integration & UI Dashboard
*   **Member 3**: Hindi Engine & Backend Routing

---

## 📄 License
This project is for academic/research purposes for the EmiHate Grid. 
Distributed under the MIT License.
