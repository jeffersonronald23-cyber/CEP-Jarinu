# 🚀 Sistema de Consulta de CEP — Jarinu

## 📌 Descrição

Sistema web para consulta e gerenciamento de CEPs do município de Jarinu.

Permite:

* 🔎 Buscar CEP por nome da rua
* ⚡ Autocomplete de logradouros
* 🛠️ Cadastrar, editar e excluir ruas
* 🔐 Controle de acesso com login
* 🌐 Acesso via navegador (frontend integrado ao backend)

---

## 🏗️ Arquitetura

```
Frontend (HTML, CSS, JS)
        ↓
FastAPI (API REST)
        ↓
Serviço de dados (CSV)
```

---

## 🧰 Tecnologias

### Backend

* Python
* FastAPI
* Uvicorn

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)

### Infraestrutura

* GitHub
* Render (Deploy)

---

## 📂 Estrutura do Projeto

```
backend/
│
├── main.py
├── api/
│   └── routes.py
├── services/
│   └── cep_service.py
├── data/
│   └── cep_jarinu.csv
├── requirements.txt
│
└── frontend/
    ├── index.html
    ├── script.js
    ├── style.css
    └── img/
```

---

## ⚙️ Instalação Local

```bash
git clone https://github.com/seuusuario/seurepo.git
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Acesse:

```
http://127.0.0.1:8000
```

---

## 🔌 Endpoints

### 🔍 Buscar rua

```
GET /api/buscar?logradouro=nome
```

### 🔎 Sugestões

```
GET /api/sugestoes?q=texto
```

### 📋 Listar ruas

```
GET /api/ruas
```

### ➕ Cadastrar

```
POST /api/cadastrar
```

### ✏️ Editar

```
PUT /api/editar/{id}
```

### ❌ Excluir

```
DELETE /api/excluir/{id}
```

### 🔐 Login

```
POST /api/login
```

---

## 🔐 Autenticação

* Sistema de login simples
* Token armazenado no navegador (localStorage)
* Proteção de rotas administrativas

---

## 🌐 Deploy

Aplicação hospedada no Render.

### Build

```
pip install -r requirements.txt
```

### Start

```
uvicorn main:app --host 0.0.0.0 --port 10000
```

---

## ⚠️ Problemas comuns

### Cache de navegador

```
Ctrl + F5
```

### Atualização de JS/CSS

```
<script src="/script.js?v=2"></script>
```

---

## 🚀 Roadmap

* [ ] Implementar banco de dados (PostgreSQL)
* [ ] Autenticação JWT
* [ ] Controle de usuários (roles)
* [ ] Dashboard com indicadores
* [ ] Integração com Power BI

---

## 📊 Possibilidades futuras

* Análise territorial
* Integração com saúde pública
* BI e indicadores municipais

---

## 👨‍💻 Autor

Jefferson Ronald Varago
