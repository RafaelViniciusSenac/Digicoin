async function Cadastrar(evento) {
    evento.preventDefault();

    const formulario = evento.target;
    const id = formulario.querySelector("#id").value;
    const nomeDesafio = formulario.querySelector("#nomeDesafio").value;
    const valorDesafio = formulario.querySelector("#valorDesafio").value;
    const descricao = formulario.querySelector("#descricao").value;
    const inicioDesafio = formulario.querySelector('#inicioDesafio').value;
    const fimDesafio = formulario.querySelector('#fimDesafio').value;
    const campanha = formulario.querySelector("#campanha").value;

    const csrf = formulario.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        if (inicioDesafio <= fimDesafio) {
            const dados = {
                nome: nomeDesafio,
                valor: valorDesafio,
                dataInicio: inicioDesafio,
                descricao: descricao,
                dataFim: fimDesafio,
                idCampanha: campanha
            };

            const headers = { 'X-CSRFToken': csrf };

            if (id) {
                const response = await apiRequest(`/api/desafio/${id}`, "PUT", dados, headers);
                console.log(response || "Erro ao editar", response);
            } else {
                const response = await apiRequest("/api/desafio/", "POST", dados, headers);
                console.log(response || "Erro ao cadastrar", response);
            }
        } else {
            alert("A Data de início não pode ser maior que a Data de fim do Desafio");
        }
    } catch (error) {
        console.error("Erro:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    document.querySelectorAll(".formDesafio").forEach(form => {
        form.addEventListener("submit", Cadastrar);
    });

    const popUpAdicionarDesafio = document.getElementById('popUpAdicionarDesafio');
    const addDesafio = document.getElementById('addDesafio');

    addDesafio.addEventListener('click', () => {
        popUpAdicionarDesafio.showModal();
    });

    document.querySelectorAll(".iconeX").forEach(icone => {
        icone.addEventListener('click', () => {
            const dialog = icone.closest("dialog");
            if (dialog) dialog.close();
        });
    });

    document.querySelectorAll(".botaoEditar").forEach(botao => {
        botao.addEventListener("click", () => {
            const id = botao.getAttribute("data-id");
            const dialog = document.getElementById(`popUpEditarDesafio-${id}`);
            if (dialog) dialog.showModal();
        });
    });
});