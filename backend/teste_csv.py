import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "../data/cep_jarinu.csv")

print("Procurando arquivo em:", CSV_PATH)
print("Existe?", os.path.exists(CSV_PATH))