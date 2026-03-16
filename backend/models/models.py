from sqlmodel import SQLModel, Field

class Rua(SQLModel, table=True):

    id: int | None = Field(default=None, primary_key=True)

    logradouro: str
    bairro: str
    cep: str
    situacao: str