@echo off
cd /d C:\FastAPI\backend
"C:\Users\PMJ TI\AppData\Local\Programs\Python\Python314\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000
pause