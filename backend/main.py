from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from backend.api.routes import router
from backend.auth.auth_service import login

app = FastAPI()


# endpoint login
@app.post("/api/login")
def login_rota(username: str, password: str):
    return login(username, password)


# registrar rotas
app.include_router(router)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_PATH = os.path.join(BASE_DIR, "..", "frontend")

app.mount("/", StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend")