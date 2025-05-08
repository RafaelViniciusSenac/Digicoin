const modalTerceiro = document.querySelector("#CriacaoDeCampanha");

const botaoTeste = document.querySelector(".buttonCriarCampanha");
botaoTeste.addEventListener('click', () => modalTerceiro.showModal())


const buttonClose3 = document.querySelector(".buttonClose3");
buttonClose3.addEventListener("click", () => {
    document.getElementById('nomeCampanha').value = "";
    document.getElementById('dataInicio').value = "";
    document.getElementById('dataFim').value = "";
    document.getElementById('descricaoCampanha').value = "";
    document.getElementById('valorEditar').value = "";
    modalTerceiro.close();
});



async function EditarCampanhas(idCampanha) {
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

    // Requisição para buscar os dados da campanha
    const dados = await apiRequest(`/api/campanha/${idCampanha}/`, 'GET', null, {
        'X-CSRFToken': csrf
    });
    
   

    // Preenche os campos do formulário de edição
    document.getElementById('nomeCampanha').value = dados.nome;
    document.getElementById('dataInicio').value = dados.dataInicio;
    document.getElementById('dataFim').value = dados.dataFim;
    document.getElementById('descricaoCampanha').value = dados.descricao;

    window.campanhasSelecionadas = [dados.idCampanha];
    document.getElementById('CriacaoDeCampanha').showModal();

    document.getElementById("valorEditar").value = idCampanha;
    
}   

async function inativarCampanhas(elemento) {


    const id = elemento
   

    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value

    const campanha = await apiRequest(`/api/campanha/${id}/`, 'GET', null, { 'X-CSRFToken': csrf });
 

    const status = campanha.is_active;


    const novoStatus = !status

    const campanhaAtualizada = {
        nome: campanha.nome,
        dataInicio: campanha.dataInicio,
        dataFim: campanha.dataFim,
        descricao: campanha.descricao,
        is_active: novoStatus
    };

    const resultado = await apiRequest(`/api/campanha/${id}/`, 'PUT', campanhaAtualizada, { 'X-CSRFToken': csrf });
    window.location.reload();


}



document.getElementById('barraBusca').addEventListener('input', function () {
    let termo = document.getElementById('barraBusca').value.toLowerCase();

    const linhas = document.querySelectorAll('.tabela_campanha_conteudo');

    linhas.forEach(linha => {
        const nome = linha.dataset.nome.toLowerCase();
        

        if (nome.includes(termo)) {
            this.parentElement
            
            linha.style.display = ''; // mostra
            

        } else {
            console.log("esconder")
            linha.style.display = 'none'; // esconde
        }
    });

    paginas['predefinida'] = 1;
    

    // Reaplica a paginação automaticamente
    mostrarPagina('predefinida'); // ou 'criadas' se for outra tabela
});


