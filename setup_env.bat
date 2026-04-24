@echo off
echo ==========================================
echo Starting Phase 1: Environment Setup
echo ==========================================

:: Step 1: Create a virtual environment named "venv" if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment "venv" already exists.
)

:: Step 2: Activate the virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

:: Step 3: Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

:: Step 4: Install correct PyTorch version with CUDA 11.8 support
echo Installing PyTorch with CUDA support (this might take a few minutes)...
:: We use index-url to fetch the specific Local GPU compute torch version
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

:: Step 5: Install all other requirements
echo Installing remaining dependencies from requirements.txt...
pip install -r requirements.txt

echo ==========================================
echo Phase 1 Setup Complete!
echo You can manually activate your environment any time using:
echo    call venv\Scripts\activate
echo ==========================================
pause
