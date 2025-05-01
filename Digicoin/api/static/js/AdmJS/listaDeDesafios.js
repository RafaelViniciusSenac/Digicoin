document.addEventListener('DOMContentLoaded', () => {

    const popUpAdicionarDesafio = document.getElementById('popUpAdicionarDesafio');
    const addDesafio = document.getElementById('addDesafio');
    const iconeX = document.getElementById('iconeX')

    addDesafio.addEventListener('click', () => {
        popUpAdicionarDesafio.showModal();

    });

    iconeX.addEventListener('click', ()=> {
        popUpAdicionarDesafio.close()
    })

    
    const botoesEditar = document.querySelectorAll(".botaoEditar");

    botoesEditar.forEach(botao => {
        botao.addEventListener("click", () => {
            const id = botao.getAttribute("data-id");
            const dialog = document.getElementById(`popUpEditarDesafio-${id}`);
            if (dialog) {
                dialog.showModal();
            }
        });
    });


    const iconesFechar = document.querySelectorAll(".iconeX");
    iconesFechar.forEach(icone => {
        icone.addEventListener("click", () => {
            const dialog = icone.closest("dialog");
            if (dialog) {
                dialog.close();
            }
        });
    });



})
// formCadastrarDesafio
async function EditarDesafio(event) {
    event.preventDefault();
    const form = event.target;

    const id = form.querySelector('#id').value;
    const nomeDesafio = form.querySelector('#nomeDesafio').value;
    const valorDesafio = form.querySelector('#valorDesafio').value;
    const descricao = form.querySelector('#descricao').value;
    const campanha = form.querySelector('#campanha').value;
    const dataInicio = form.querySelector('#inicioDesafio').value;
    const dataFim = form.querySelector('#fimDesafio').value;
    const csrf = form.querySelector('[name=csrfmiddlewaretoken]').value;

    
    if (!nomeDesafio || !valorDesafio) {
        alert("Nome do desafio e valor do desafio devem ser preenchidos.");
        return;
    }
    if (dataFim < dataInicio) {
        
        alert("A data de fim deve ser maior que a data de inicio.");
        return;
    }

    const response = await apiRequest(`/api/desafio/${id}/`, 'PUT', {nome:nomeDesafio, valor:valorDesafio, descricao:descricao, campanha:campanha}, {'X-CSRFToken':csrf});
    console.log(response);
    
    window.location.reload();
}

const forms = document.querySelectorAll('form[id^="formCadastrarDesafio"]');
forms.forEach(form => {
    form.addEventListener('submit', EditarDesafio);
});
