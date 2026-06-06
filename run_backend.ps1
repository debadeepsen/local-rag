cd apps/api;
.venv/Scripts/Activate.ps1;
pip install -r requirements.txt;
uvicorn app.main:app --reload --host localhost --port 8000;