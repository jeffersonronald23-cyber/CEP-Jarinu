from fastapi import APIRouter, Depends

from backend.auth.auth_service import validar_token

from backend.services.cep_service import (
    buscar_rua,
    sugestoes_rua,
    listar_ruas,
    cadastrar_rua,
    editar_rua,
    excluir_rua
)

router = APIRouter(prefix="/api")


@router.get("/buscar")
def buscar(logradouro: str):
    return buscar_rua(logradouro)


@router.get("/sugestoes")
def sugestoes_rota(q: str):
    return sugestoes_rua(q)


@router.get("/ruas")
def listar():
    return listar_ruas()


# rotas protegidas

@router.post("/cadastrar")
def cadastrar(logradouro: str, bairro: str, cep: str, situacao: str, user = Depends(validar_token)):
    return cadastrar_rua(logradouro, bairro, cep, situacao)


@router.put("/editar/{id}")
def editar(id: int, logradouro: str, bairro: str, cep: str, situacao: str, user = Depends(validar_token)):
    return editar_rua(id, logradouro, bairro, cep, situacao)


@router.delete("/excluir/{id}")
def excluir(id: int, user = Depends(validar_token)):
    return excluir_rua(id)