# Stage 1: Build stage
FROM python:3.10-slim as builder

# Install system dependencies needed for building some python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy requirements file
COPY requirements.txt .

# Install dependencies into a temporary directory
# We use --user to install to a specific location that we can copy
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Runtime stage
FROM python:3.10-slim

# Set environment variables
# PYTHONDONTWRITEBYTECODE: Prevents Python from writing .pyc files
# PYTHONUNBUFFERED: Ensures logs are delivered to the terminal in real-time
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app \
    PORT=5051

# Install runtime system dependencies for OCR and Image processing
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy project files
# We only copy the necessary directories
COPY api/ /app/api/
COPY frontend/ /app/frontend/
COPY src/ /app/src/
COPY models/ /app/models/

# Ensure ownership for the non-root user
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 5051

# Healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5051/api/health || exit 1

# Run the application
# We use --app-dir to point to the 'api' folder so that internal imports (like 'from inference import') work
CMD ["uvicorn", "main:app", "--app-dir", "api", "--host", "0.0.0.0", "--port", "5051"]
