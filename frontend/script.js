// ------------------------------------------------
// TROCAR PÁGINAS
// ------------------------------------------------

function mostrarPagina(id){

document.querySelectorAll(".pagina").forEach(p=>{
p.style.display="none";
});

let pagina = document.getElementById(id);

if(pagina){
pagina.style.display="block";
}

if(id === "lista"){
carregarRuas();
}

}

//---VERIFICAÇÃO DE LOGIN


function usuarioLogado(){
    return localStorage.getItem("token") !== null;
}

//--------LOGOLT
function logout(){

localStorage.removeItem("token");

alert("Logout realizado");

location.reload();

}
// ------------------------------------------------
// TOKEN
// ------------------------------------------------

function getToken(){
return localStorage.getItem("token");
}



// ------------------------------------------------
// CONSULTAR CEP
// ------------------------------------------------

async function buscar(){

    let rua = document.getElementById("rua").value;

    if(!rua){
        return;
    }

    let response = await fetch(`/api/buscar?logradouro=${encodeURIComponent(rua)}`);
    let data = await response.json();

    let div = document.getElementById("resultado");

    if(!data || data.length === 0){
        div.innerHTML = "Rua não encontrada";
        return;
    }

    // 🔥 LISTA DE RESULTADOS
    div.innerHTML = "<h3>Selecione o endereço:</h3>";

    data.forEach((r, index) => {

        let item = document.createElement("div");

        item.style.border = "1px solid #ccc";
        item.style.padding = "10px";
        item.style.marginTop = "10px";
        item.style.cursor = "pointer";
        item.style.borderRadius = "5px";

        item.innerHTML = `
            <b>${r.Logradouro}</b><br>
            Bairro: ${r.Bairro}<br>
            CEP: ${r.CEP}
        `;

        // 👇 quando clicar, mostra detalhe
        item.onclick = function(){
            mostrarDetalhe(r);
        };

        div.appendChild(item);

    });

}

function mostrarDetalhe(r){

    let div = document.getElementById("resultado");

    div.innerHTML = `
        <h3>Endereço selecionado</h3>
        <p><b>Logradouro:</b> ${r.Logradouro}</p>
        <p><b>Bairro:</b> ${r.Bairro}</p>
        <p><b>CEP:</b> ${r.CEP}</p>
        <p><b>Situação:</b> ${r.Situacao}</p>
    `;

}


// ------------------------------------------------
// CADASTRAR
// ------------------------------------------------


async function cadastrarRua(){

if(!usuarioLogado()){
alert("Faça login para cadastrar ruas");
return;
}

let logradouro = document.getElementById("novo_logradouro").value;
let bairro = document.getElementById("novo_bairro").value;
let cep = document.getElementById("novo_cep").value;
let situacao = document.getElementById("novo_situacao").value;

let token = getToken();

let response = await fetch(
`/api/cadastrar?logradouro=${encodeURIComponent(logradouro)}&bairro=${encodeURIComponent(bairro)}&cep=${encodeURIComponent(cep)}&situacao=${encodeURIComponent(situacao)}`,
{
method:"POST",
headers:{
Authorization: token
}
}
);

let data = await response.json();

document.getElementById("resultadoCadastro").innerHTML = data.status;

}



// ------------------------------------------------
// LISTAR RUAS
// ------------------------------------------------

async function carregarRuas(){

let response = await fetch("/api/ruas");

let data = await response.json();

renderTabela(data);

}



// ------------------------------------------------
// RENDER TABELA
// ------------------------------------------------

function renderTabela(data){

let tbody = document.querySelector("#tabelaRuas tbody");

tbody.innerHTML="";

if(!data || data.length === 0){

tbody.innerHTML = "<tr><td colspan='5'>Nenhuma rua encontrada</td></tr>";

return;

}

data.forEach(rua=>{

let tr=document.createElement("tr");

tr.innerHTML=`
<td>${rua.Logradouro}</td>
<td>${rua.Bairro}</td>
<td>${rua.CEP}</td>
<td>${rua.Situacao}</td>
<td>
<button onclick="editarRua(${rua.id})">Editar</button>
<button onclick="excluirRua(${rua.id})">Excluir</button>
</td>
`;

tbody.appendChild(tr);

});

}



// ------------------------------------------------
// BUSCAR RUA NA LISTA (ADMIN)
// ------------------------------------------------

async function buscarRuaAdmin(){

const texto = document.getElementById("buscarRuaAdmin").value.trim();

if(texto.length === 0){
carregarRuas();
return;
}

try{

const response = await fetch(`/api/buscar?logradouro=${encodeURIComponent(texto)}`);

const data = await response.json();

renderTabela(data);

}catch(err){

console.error("Erro na busca:", err);

}

}



// ------------------------------------------------
// EXCLUIR
// ------------------------------------------------

async function excluirRua(id){


if(!usuarioLogado()){
alert("Faça login para excluir");
return;
}
if(!confirm("Deseja excluir esta rua?")) return;

let token = getToken();

await fetch(`/api/excluir/${id}`,{
method:"DELETE",
headers:{
Authorization: token
}
});

carregarRuas();

}



// ------------------------------------------------
// EDITAR
// ------------------------------------------------

async function editarRua(id){

if(!usuarioLogado()){
alert("Faça login para editar");
return;
}
let logradouro = prompt("Novo logradouro:");
let bairro = prompt("Novo bairro:");
let cep = prompt("Novo CEP:");
let situacao = prompt("Nova situação:");

if(!logradouro || !bairro || !cep || !situacao) return;

let token = getToken();

await fetch(
`/api/editar/${id}?logradouro=${encodeURIComponent(logradouro)}&bairro=${encodeURIComponent(bairro)}&cep=${encodeURIComponent(cep)}&situacao=${encodeURIComponent(situacao)}`,
{
method:"PUT",
headers:{
Authorization: token
}
}
);

carregarRuas();

}



// ------------------------------------------------
// AUTOCOMPLETE
// ------------------------------------------------

document.addEventListener("DOMContentLoaded", function(){

    if(!usuarioLogado()){

document.querySelectorAll(".admin").forEach(el=>{
el.style.display="none";
});

}
const input = document.getElementById("rua");
const sugestoesBox = document.getElementById("sugestoes");

if(input && sugestoesBox){

input.addEventListener("input", async function(){

let texto = input.value.trim();

if(texto.length < 2){
sugestoesBox.innerHTML = "";
return;
}

try{

let response = await fetch(`/api/sugestoes?q=${encodeURIComponent(texto)}`);

let dados = await response.json();

sugestoesBox.innerHTML = "";

dados.forEach(function(rua){

let item = document.createElement("div");

item.classList.add("item-sugestao");

item.innerText = rua;

item.onclick = function(){

input.value = rua;

sugestoesBox.innerHTML = "";

};

sugestoesBox.appendChild(item);

});

}catch(err){

console.error("Erro autocomplete:", err);

}

});

}



// ------------------------------------------------
// BUSCA ADMIN AUTOMÁTICA
// ------------------------------------------------

const buscaAdmin = document.getElementById("buscarRuaAdmin");

if(buscaAdmin){

buscaAdmin.addEventListener("input", function(){

buscarRuaAdmin();

});

}

});



// ------------------------------------------------
// LOGIN
// ------------------------------------------------

async function login(){

let usuario = document.getElementById("usuario").value;
let senha = document.getElementById("senha").value;

try{

let response = await fetch(`/api/login?username=${encodeURIComponent(usuario)}&password=${encodeURIComponent(senha)}`,{
method:"POST"
});

if(response.status !== 200){

document.getElementById("statusLogin").innerHTML = "Usuário ou senha inválidos";

return;

}

let data = await response.json();

localStorage.setItem("token", data.token);

document.getElementById("statusLogin").innerHTML = "Login realizado com sucesso";

}catch(err){

console.error(err);

}

}