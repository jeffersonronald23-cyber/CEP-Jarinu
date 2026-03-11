import webbrowser
import threading
import uvicorn

def abrir_navegador():
    webbrowser.open("http://127.0.0.1:8000")

threading.Timer(2, abrir_navegador).start()

uvicorn.run(
    "backend.main:app",
    host="127.0.0.1",
    port=8000
)
