async function buscar(){

let rua = document.getElementById("rua").value;

let response = await fetch(`/buscar?logradouro=${rua}`);

let data = await response.json();

let div = document.getElementById("resultado");

if(data.erro){
    div.innerHTML = "Rua não encontrada";
}
else{

div.innerHTML = `
<p><b>Logradouro:</b> ${data.logradouro}</p>
<p><b>Bairro:</b> ${data.bairro}</p>
<p><b>CEP:</b> ${data.cep}</p>
<p><b>Situação:</b> ${data.situacao}</p>
`;

}
}

document.addEventListener("DOMContentLoaded", () => {

const input = document.getElementById("rua");
const sugestoesBox = document.getElementById("sugestoes");

input.addEventListener("input", async function(){

    const texto = input.value;

    if(texto.length < 2){
        sugestoesBox.innerHTML="";
        return;
    }

    const resposta = await fetch(`/sugestoes?q=${texto}`);
    const dados = await resposta.json();

    sugestoesBox.innerHTML="";

    dados.forEach(rua => {

        const item=document.createElement("div");

        item.classList.add("item-sugestao");

        item.textContent=rua;

        item.onclick = () => {

            input.value=rua;

            sugestoesBox.innerHTML="";

        };

        sugestoesBox.appendChild(item);

    });

});

});