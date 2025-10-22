document.addEventListener("DOMContentLoaded", function () {
    const modalPrimeiro = document.querySelector("#popupEditarProduto");
    const buttonOpen = document.querySelector(".buttonOpen");
    buttonOpen.addEventListener("click", () => {
        const uploadBox = document.querySelector(".UploadBox");
        uploadBox.classList.remove("has-image");
        uploadBox.style.backgroundImage = ""; // remove a imagem
        document.getElementById("imagem").value = ""; // limpa o input file
        modalPrimeiro.showModal();
    });

    // Função para exibir erros
    function ShowError(input, mensagem) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        if (small) {
            small.textContent = mensagem;
            small.classList.add("error");
        }
    }

    // Função para remover erros
    function ShowSucesso(input) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        if (small) {
            // small.textContent = "";
            small.classList.remove("error");
        }
    }

    // Valida campos obrigatórios
    function checkRequired(inputs) {
        return inputs.every(input => {
            if (input.value.trim() === "") {
                ShowError(input, "Campo obrigatório");
                return false;
            } else {
                ShowSucesso(input);
                return true;
            }
        });
    }

    // Valida checkbox campanha
    function checkCampanhaRequired() {
        const checkbox = document.getElementById('Campanha');
        if (!checkbox.checked) {
            // ShowError(checkbox, "*");
            return false;
        } else {
            ShowSucesso(checkbox);
            return true;
        }
    }

    // Valida Físico ou Virtual
    function checkFisicoVirtualRequired() {
        const fisico = document.getElementById('Fisico');
        const virtual = document.getElementById('Virtual');
        if (!fisico.checked && !virtual.checked) {
            // ShowError(fisico, "Escolha uma opção");
            return false;
        } else {
            ShowSucesso(fisico);
            return true;
        }
    }

    // Exclusividade entre Físico e Virtual
    document.getElementById('Fisico').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('Virtual').checked = false;
        }
        checkFisicoVirtualRequired();
    });

    document.getElementById('Virtual').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('Fisico').checked = false;
        }
        checkFisicoVirtualRequired();
    });

    // Valida ao clicar em Concluir
    

    // Fecha todos os modais e limpa
    document.querySelector('.buttonClose').addEventListener('click', () => {
        document.getElementById('popupEditarProduto').close();
        document.getElementById('popupConcluir').close();

        document.getElementById('Produto').value = "";
        document.getElementById('Quantidade').value = "";
        document.getElementById('Preco').value = "";
        document.getElementById('Descricao').value = "";
        document.getElementById('Campanha').checked = false;
        document.getElementById('Fisico').checked = false;
        document.getElementById('Virtual').checked = false;
        window.campanhasSelecionadas = [];
        preencherPopupConcluir([]);

        // Limpa smalls de erro
        document.querySelectorAll('small.alerta').forEach(small => {
                
            small.classList.remove("error");
        });
    });

    // Fecha só o segundo modal
    document.querySelector('.buttonClose2').addEventListener('click', () => {
        document.getElementById('popupConcluir').close();
    });

}); // <-- Fim do DOMContentLoaded

function preencherPopupConcluir(campanhasSelecionadas = []) {
    document.querySelectorAll('.listaCampanha').forEach(checkbox => {
        const valor = parseInt(checkbox.value);
        checkbox.checked = campanhasSelecionadas.includes(valor);
    });
}

async function inativar (elemento) {
    const confirmar = await confirmarAcao('Tem certeza que deseja inativar este produto?', 'Inativar Produto');

    if(!confirmar){
        return
    }

    const id = elemento

    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value

    const produto = await apiRequest(`/api/produto/${id}/`, 'GET', null, { 'X-CSRFToken': csrf });

    const status = produto.is_active;

    const novoStatus = !status

    const produtoAtualizado = {
        nome: produto.nome,
        img1: null,
        img2: null,
        img3: null,
        valor: produto.valor,
        descricao: produto.descricao,
        quantidade: produto.quantidade,
        tipo: produto.tipo,
        is_active: novoStatus,
        idCampanha: produto.idCampanha
    };

    await apiRequest(`/api/produto/${id}/`, 'PUT', produtoAtualizado, { 'X-CSRFToken': csrf });
    window.location.reload();
}

async function Editar(idProduto) {
    const uploadBox = document.querySelector(".UploadBox");
    uploadBox.classList.remove("has-image");
    uploadBox.style.backgroundImage = ""; // remove a imagem
    document.getElementById("imagem").value = ""; // limpa o input file


    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const dados = await apiRequest(`/api/produto/${idProduto}/`, 'GET', null, { 'X-CSRFToken': csrf });
    
    document.getElementById('Produto').value = dados.nome;
    document.getElementById('Descricao').value = dados.descricao || "";
    document.getElementById('Quantidade').value = aplicarMascaraMilhar(dados.quantidade.toString());
    document.getElementById('Preco').value = aplicarMascaraMilhar(dados.valor.toString());
    if (dados.idCampanha != null) {
        document.getElementById('Campanha').checked = true;

    }else{
        document.getElementById('Campanha').checked = false;
    }
    
    uploadBox.classList.add("has-image");
    uploadBox.style.backgroundImage = `url(${dados.img1})`;
    uploadBox.style.backgroundSize = "contain";
    uploadBox.style.backgroundRepeat = "no-repeat";
    uploadBox.style.backgroundPosition = "center";

    if (dados.tipo.toLowerCase() === "físico") {
        document.getElementById('Fisico').checked = true;
    } else if (dados.tipo.toLowerCase() === "virtual") {
        document.getElementById('Virtual').checked = true;
    }

    // Desmarca todas as campanhas primeiro
    document.querySelectorAll('.listaCampanha').forEach(cb => cb.checked = false);

    // Marca a campanha correspondente ao ID do banco
    if (dados.idCampanha != null) {
        const checkbox = document.querySelector(`.listaCampanha[value="${dados.idCampanha}"]`);
        if (checkbox) checkbox.checked = true;
    }
    

    window.campanhasSelecionadas = [dados.idCampanha];
    document.getElementById('popupEditarProduto').showModal();

    document.getElementById("valorEditar2").value = idProduto;
}

// Aplica ao digitar no campo
function mascaraMilhar(input) {
    input.value = aplicarMascaraMilhar(input.value);
}

// Para aplicar ao valor vindo do banco
function aplicarMascaraMilhar(valor) {
    valor = valor.replace(/\D/g, "");
    // Impede zero no começo (só se tiver mais de 1 dígito)
    if (valor.length > 1 && valor.startsWith("0")) {
        valor = valor.replace(/^0+/, "");
    }
    
    return valor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); 
}

// Se quiser usar antes de enviar pro banco:
function removerMascaraMilhar(valor) {
    return valor.replace(/\./g, "");
}

function bloqueiaCaracteresIndesejados(event) {
    const caracteresBloqueados = [",", ".", "-", "+", "e"];
    if (caracteresBloqueados.includes(event.key)) {
        event.preventDefault();
        return false;
    }
}

function aplicarMascaraPontuacao(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;

    let valor = elemento.textContent.trim(); // pega o texto dentro do span
    valor = valor.replace(/\D/g, ""); // remove tudo que não for número
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // adiciona pontos

    elemento.textContent = valor; // coloca de volta no HTML
}
