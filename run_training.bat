@echo off
echo ==========================================
echo Starting Phase 2: Autonomous Local Training
echo ==========================================

:: Activate environment
if not exist "venv\" (
    echo Error: Environment entirely missing! Please execute setup_env.bat first!
    pause
    exit /b
)
call venv\Scripts\activate.bat

:: Execute highly optimized trainer
echo Executing src\train.py using Virtual Environment...
python -u src\train.py

echo ==========================================
echo Training Sequence Finalized!
echo Check 'models/' to consume your custom trained safetensors/bins.
echo ==========================================
pause
