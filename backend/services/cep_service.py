import os
import csv
from rapidfuzz import process
import unicodedata
import re
import unicodedata


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CSV_PATH = os.path.join(BASE_DIR, "..", "data", "cep_jarinu.csv")

DATA = []


def detect_delimiter(sample_path):

    with open(sample_path, "r", encoding="latin-1") as f:

        first_line = f.readline()

        if ";" in first_line:
            return ";"

        return ","


DELIMITER = detect_delimiter(CSV_PATH)


# ------------------------------------------------
# CARREGAR CSV
# ------------------------------------------------

def carregar_csv():

    global DATA

    DATA = []

    with open(CSV_PATH, encoding="latin-1") as f:

        reader = csv.DictReader(f, delimiter=DELIMITER)

        for idx, row in enumerate(reader):

            clean_row = {
                "id": idx,
                "Logradouro": row.get("Logradouro", "").strip(),
                "Bairro": row.get("Bairro", "").strip(),
                "CEP": row.get("CEP", "").strip(),
                "Situacao": row.get("Situacao", "").strip()
            }

            DATA.append(clean_row)

    print("RUAS CARREGADAS:", len(DATA))


carregar_csv()



def normalizar(texto):
    if not texto:
        return ""
    texto = texto.lower().strip()
    return "".join(
        c for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )

def buscar_rua(logradouro: str, bairro: str = None):
    logradouro = normalizar(logradouro)
    bairro = normalizar(bairro) if bairro else None

    resultados = []
    tem_numero = re.search(r"\d+$", logradouro)

    for row in DATA:
        nome_rua = normalizar(row["Logradouro"])
        nome_bairro = normalizar(row["Bairro"])

        if tem_numero:
            match_rua = (nome_rua == logradouro) or (nome_rua.startswith(logradouro + " "))
        else:
            match_rua = nome_rua.startswith(logradouro)

        if match_rua:
            if bairro:
                if nome_bairro == bairro:
                    resultados.append(row)
            else:
                resultados.append(row)

    return resultados
# ------------------------------------------------
# SUGESTÕES
# ------------------------------------------------
def normalizar(texto):
    if not texto:
        return ""
    texto = texto.lower().strip()
    return "".join(
        c for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )

def sugestoes_rua(q: str):

    ruas = [row["Logradouro"] for row in DATA]

    resultados = process.extract(
        q,
        ruas,
        limit=10,
        score_cutoff=60
    )

    return [r[0] for r in resultados]

def sugestoes_bairro(q: str):

    q = normalizar(q)

    bairros = list(set([row["Bairro"] for row in DATA]))

    resultados = []

    for bairro in bairros:

        bairro_norm = normalizar(bairro)

        # 🔥 PRIORIDADE: começa com o texto
        if bairro_norm.startswith(q):
            resultados.append(bairro)

    # 🔥 fallback (caso não encontre nada)
    if not resultados:
        for bairro in bairros:
            if q in normalizar(bairro):
                resultados.append(bairro)

    return resultados[:10]

# ------------------------------------------------
# LISTAR RUAS
# ------------------------------------------------

def listar_ruas():

    return DATA


# ------------------------------------------------
# CADASTRAR
# ------------------------------------------------

def cadastrar_rua(logradouro, bairro, cep, situacao):

    novo_id = len(DATA)

    nova_rua = {
        "id": novo_id,
        "Logradouro": logradouro,
        "Bairro": bairro,
        "CEP": cep,
        "Situacao": situacao
    }

    DATA.append(nova_rua)

    salvar_csv()

    return {"status": "Rua cadastrada com sucesso"}


# ------------------------------------------------
# EDITAR
# ------------------------------------------------

def editar_rua(id, logradouro, bairro, cep, situacao):

    for row in DATA:

        if row["id"] == id:

            row["Logradouro"] = logradouro
            row["Bairro"] = bairro
            row["CEP"] = cep
            row["Situacao"] = situacao

            salvar_csv()

            return {"status": "Rua atualizada"}

    return {"erro": "ID não encontrado"}


# ------------------------------------------------
# EXCLUIR
# ------------------------------------------------

def excluir_rua(id):

    global DATA

    DATA = [row for row in DATA if row["id"] != id]

    for idx, row in enumerate(DATA):
        row["id"] = idx

    salvar_csv()

    return {"status": "Rua excluída"}


# ------------------------------------------------
# SALVAR CSV
# ------------------------------------------------

def salvar_csv():

    with open(CSV_PATH, "w", encoding="latin-1", newline="") as f:

        writer = csv.writer(f, delimiter=DELIMITER)

        writer.writerow(["Logradouro", "Bairro", "CEP", "Situacao"])

        for row in DATA:

            writer.writerow([
                row["Logradouro"],
                row["Bairro"],
                row["CEP"],
                row["Situacao"]
            ])