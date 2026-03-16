// ------------------------------------------------
// TROCAR PÁGINAS
// ------------------------------------------------

function mostrarPagina(id){

document.querySelectorAll(".pagina").forEach(p=>{
p.style.display="none";
});

document.getElementById(id).style.display="block";

}



// ------------------------------------------------
// CONSULTAR CEP
// ------------------------------------------------

async function buscar(){

let rua = document.getElementById("rua").value;

let response = await fetch(`/api/buscar?logradouro=${encodeURIComponent(rua)}`);

let data = await response.json();

let div = document.getElementById("resultado");

if(!data || data.length === 0){
div.innerHTML = "Rua não encontrada";
return;
}

let r = data[0];

div.innerHTML = `
<p><b>Logradouro:</b> ${r.Logradouro}</p>
<p><b>Bairro:</b> ${r.Bairro}</p>
<p><b>CEP:</b> ${r.CEP}</p>
<p><b>Situação:</b> ${r.Situacao}</p>
`;

}



// ------------------------------------------------
// CADASTRAR RUA
// ------------------------------------------------

async function cadastrarRua(){

let logradouro = document.getElementById("novo_logradouro").value;
let bairro = document.getElementById("novo_bairro").value;
let cep = document.getElementById("novo_cep").value;
let situacao = document.getElementById("novo_situacao").value;

let response = await fetch(
`/api/cadastrar?logradouro=${encodeURIComponent(logradouro)}&bairro=${encodeURIComponent(bairro)}&cep=${encodeURIComponent(cep)}&situacao=${encodeURIComponent(situacao)}`,
{method:"POST"}
);

let data = await response.json();

document.getElementById("resultadoCadastro").innerHTML = data.status;

document.getElementById("novo_logradouro").value="";
document.getElementById("novo_bairro").value="";
document.getElementById("novo_cep").value="";
document.getElementById("novo_situacao").value="";

}



// ------------------------------------------------
// LISTAR RUAS
// ------------------------------------------------

async function carregarRuas(){

let response = await fetch("/api/ruas");

let data = await response.json();

let tbody = document.querySelector("#tabelaRuas tbody");

tbody.innerHTML="";

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
// EXCLUIR RUA
// ------------------------------------------------

async function excluirRua(id){

if(!confirm("Deseja excluir esta rua?")) return;

await fetch(`/api/excluir/${id}`,{
method:"DELETE"
});

carregarRuas();

}



// ------------------------------------------------
// EDITAR RUA
// ------------------------------------------------

async function editarRua(id){

let logradouro = prompt("Novo logradouro:");
let bairro = prompt("Novo bairro:");
let cep = prompt("Novo CEP:");
let situacao = prompt("Nova situação:");

if(!logradouro || !bairro || !cep || !situacao) return;

await fetch(
`/api/editar/${id}?logradouro=${encodeURIComponent(logradouro)}&bairro=${encodeURIComponent(bairro)}&cep=${encodeURIComponent(cep)}&situacao=${encodeURIComponent(situacao)}`,
{
method:"PUT"
}
);

carregarRuas();

}



// ------------------------------------------------
// AUTOCOMPLETE
// ------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

const input = document.getElementById("rua");
const sugestoesBox = document.getElementById("sugestoes");

input.addEventListener("input", async function(){

const texto = input.value;

if(texto.length < 2){
sugestoesBox.innerHTML="";
return;
}

const resposta = await fetch(`/api/sugestoes?q=${encodeURIComponent(texto)}`);
const dados = await resposta.json();

sugestoesBox.innerHTML="";

dados.forEach(rua => {

const item=document.createElement("div");

item.classList.add("item-sugestao");

item.textContent=rua;

item.onclick=()=>{

input.value=rua;

sugestoesBox.innerHTML="";

};

sugestoesBox.appendChild(item);

});

});

});