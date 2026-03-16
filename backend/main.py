import csv
from multiprocessing import process

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.api.routes import router

import os

from backend.services.cep_service import CSV_PATH

app = FastAPI(title="API CEP Jarinu")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# incluir rotas da API
app.include_router(router)

# caminho frontend
BASE_DIR: str = os.path.dirname(os.path.abspath(__file__))
FRONTEND_PATH = os.path.join(BASE_DIR, "..", "frontend")

DATA = []

# Detectar separador do CSV
def detect_delimiter(sample_path):
    with open(sample_path, "r", encoding="latin-1") as f:
        first_line = f.readline()
        if ";" in first_line:
            return ";"
        return ","

DELIMITER = detect_delimiter(CSV_PATH)

# Ler CSV
with open(CSV_PATH, encoding="latin-1") as f:
    reader = csv.DictReader(f, delimiter=DELIMITER)
    for row in reader:
        if row is None:
            continue

        clean_row = {
            k.strip(): (v.strip() if v else "")
            for k, v in row.items()
            if k
        }

        DATA.append(clean_row)

print(f"Linhas carregadas: {len(DATA)}")

# Endpoint de busca
@app.get("/buscar")
def buscar(logradouro: str):

    logradouro = logradouro.lower()

    for row in DATA:

        if "Logradouro" in row and logradouro in row["Logradouro"].lower():

            return {
                "logradouro": row.get("Logradouro", ""),
                "bairro": row.get("Bairro", ""),
                "cep": row.get("CEP", ""),
                "situacao": row.get("Situacao", "")
            }

    return {"erro": "Não encontrado"}

@app.get("/sugestoes")
def sugestoes(q: str):

    ruas = [row.get("Logradouro","") for row in DATA if row.get("Logradouro")]

    resultados = process.extract(
        q,
        ruas,
        limit=10,
        score_cutoff=60
    )

    return [r[0] for r in resultados]
# Servir frontend
app.mount("/", StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend")