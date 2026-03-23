from fastapi import HTTPException, Header

# usuários do sistema
usuarios = {
    "admin": "Saude@246"
}

# sessões ativas
SESSIONS = {}


def login(username: str, password: str):

    if username in usuarios and usuarios[username] == password:

        token = username + "_token"

        SESSIONS[token] = username

        return {"token": token}

    raise HTTPException(status_code=401, detail="Usuário ou senha inválidos")


def validar_token(authorization: str = Header(None)):

    if authorization not in SESSIONS:
        raise HTTPException(status_code=401, detail="Não autorizado")

    return SESSIONS[authorization]