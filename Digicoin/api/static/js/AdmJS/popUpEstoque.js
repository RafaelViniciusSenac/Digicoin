// Selecionando os elementos do popup e formulário
document.addEventListener("DOMContentLoaded", function () {
    const modalPrimeiro = document.querySelector("#popupEditarProduto");
    const modalSegundo = document.querySelector("#popupConcluir");
    const modalTerceiro = document.querySelector("#CriacaoDeCampanha");
    
    const buttonClose = document.querySelector(".buttonClose");
    const buttonConcluir = document.querySelector(".buttonConcluir");
    const buttonClose2 = document.querySelector(".buttonClose2");
    const buttonLinkCampanha = document.querySelector(".CriarNovaCampanha");
    const buttonClose3 = document.querySelector(".buttonClose3");

    const produto = document.getElementById("Produto");
    const descricao = document.getElementById("Descricao") // PROBLEMA É AQUI, VALIDAÇÃO DO ERRO DO PRODUTO É IGUAL COM A DA DESCRIÇÃO, ME AJUDE A ARRUMAR ISSO

    const quantidade = document.getElementById("Quantidade");
    quantidade.addEventListener("change", function () {
        mascaraMilhar(quantidade);
    });

    quantidade.addEventListener("keydown", function (event) {
        bloqueiaCaracteresIndesejados(event);
    });

    const preco = document.getElementById("Preco");
    preco.addEventListener("input", function () {
        mascaraMilhar(preco);
    });

    preco.addEventListener("keydown", function (event) {
        bloqueiaCaracteresIndesejados(event);
    });

    const campanhaCheckbox = document.getElementById("Campanha");

    const campanhaLista = document.querySelector(".temaCampanhaCorpo");

    function resetarFormularioProduto() {
        const campos = [produto, descricao, quantidade, preco];

        campos.forEach((input) => {
            input.value = "";
            const formControl = input.parentElement;
            const small = formControl.querySelector("small");
            const campoInput = formControl.querySelector("input");

            if (small) {
                small.classList.remove("error");
            }

            if (campoInput) {
                campoInput.classList.remove("error");
            }
        });

        // Limpa imagem
        const uploadBox = document.querySelector(".UploadBox");
        const uploadIcon = document.querySelector(".upload-icon");
        const imagemInput = document.getElementById("imagem");

        uploadBox.style.backgroundImage = "";
        uploadBox.classList.remove("has-image", "erro-upload");
        uploadIcon.classList.remove("erro-icon");
        if (imagemInput) imagemInput.value = "";

        // Limpa checkboxes
        document.getElementById("Fisico").checked = false;
        document.getElementById("Virtual").checked = false;
        document.getElementById("Campanha").checked = false;

        document.getElementById("erroFisico").classList.remove("error");
        document.getElementById("erroVirtual").classList.remove("error");

        // Reseta controle
        controle = true;
        btnConcluir.setAttribute("type", "button");
    }

    function resetarFormularioCampanha() {
        const campos = [nomeCampanha, dataFim];

        campos.forEach((input) => {
            input.value = "";
            const formControl = input.parentElement;
            const small = formControl.querySelector("small");
            const campoInput = formControl.querySelector("input");

            if (small) {
                small.classList.remove("error");
            }

            if (campoInput) {
                campoInput.classList.remove("error");
            }
        });

        // Reset geral do formulário, se quiser garantir
        // const form = document.getElementById("CriacaoDeCampanhaForm");
        // if (form) form.reset();
    }

    // Função para exibir erros
    function ShowError(input, mensagem) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        const forms = formControl.querySelector("input");

        small.textContent = mensagem;
        forms.classList.add("error");
        small.classList.add("error");
    }

    // Função para remover erros
    function ShowSucesso(input) {
        const formControl = input.parentElement;
        const small = formControl.querySelector("small");
        const forms = formControl.querySelector("input");

        forms.classList.remove("error");
        small.classList.remove("error");
    }

    // Função de validação dos campos obrigatórios
    function checkRequired(inputs) {
        let isValid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "") {
                ShowError(input, "Campo obrigatório");
                isValid = false;
            } else {
                ShowSucesso(input);
            }
        });

        return isValid;
    }


    // Função para validar o checkbox de Campanha
    function checkCampanhaRequired() {
        if (!campanhaCheckbox.checked) {
            
            return false;
        } else {
            
            return true;
        }
    }


    // Função para validar Físico e Virtual
    function checkFisicoVirtualRequired() {
        const fisicoCheckbox = document.getElementById('Fisico');
        const virtualCheckbox = document.getElementById('Virtual');

        const erroFisico = document.getElementById('erroFisico');
        const erroVirtual = document.getElementById('erroVirtual');

        if (!fisicoCheckbox.checked && !virtualCheckbox.checked) {
            
            erroFisico.classList.add('error');

            erroVirtual.classList.add('error');

            return false;
        } else {
            
            erroFisico.classList.remove('error');

            
            erroVirtual.classList.remove('error');

            return true;
        }
    }


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

    function temImagemOuImagemExistente() {
        const uploadBox = document.querySelector(".UploadBox");
        const imgPopUp = document.getElementById('imagem');
        const uploadIcon = document.querySelector(".upload-icon");

        if (uploadBox.classList.contains("has-image") || (imgPopUp.files && imgPopUp.files.length > 0)) {
            uploadBox.classList.remove("erro-upload");
            uploadIcon.classList.remove("erro-icon"); 
            return true;
        } else {
            uploadBox.classList.add("erro-upload");
            uploadIcon.classList.add("erro-icon"); 

            return false;
        }  
    }
    
    
    function checkComparacao() {
        const checkboxes = document.getElementsByClassName('listaCampanha');

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                return true;  // achou pelo menos um marcado
            }
        }

        return false;  // nenhum marcado
    }


        

    // Eventos para abrir e fechar popups
    let controle = true
    const btnConcluir = document.getElementById("btnConcluir");
    if (controle) {
        
        // Se controle == true → queremos tipo 'button'
        btnConcluir.setAttribute("type", "button");
    } else {
        
        // Se controle == false → queremos tipo 'submit'
        btnConcluir.setAttribute("type", "submit");
    }


    buttonClose.addEventListener("click", () => {
        modalPrimeiro.close();
        resetarFormularioProduto();
    });
    // Configura apenas uma vez, no carregamento
    document.getElementById("produtoForm2").addEventListener("submit", (e) => {
        if (!checkComparacao()) {
            e.preventDefault(); // bloqueia en vio se não tiver checkbox marcado
        } else {
            handleSubmit(e);
        }
    });



    // Quando clicar no botão concluir
    buttonConcluir.addEventListener("click", () => {
    
        const camposObrigatoriosOk = checkRequired([produto, descricao, quantidade, preco]);
        const tipoOk = checkFisicoVirtualRequired();
        const imagemOk = temImagemOuImagemExistente();  // Chama só 1 vez
        const campanhaOk = checkCampanhaRequired();

        const camposComCampanha = camposObrigatoriosOk && tipoOk && imagemOk && campanhaOk;
        const camposSemCampanha = camposObrigatoriosOk && tipoOk && imagemOk;

        
        if (camposComCampanha) {
            // Caso 1 → controle true → abre modal
            
            controle = true
            btnConcluir.setAttribute("type", "button");  // apenas abre modal
            modalSegundo.showModal();

                // Configura botões do modal (fechar e links)
            buttonClose2.addEventListener("click", () => modalSegundo.close());
            buttonLinkCampanha.addEventListener("click", () => modalTerceiro.showModal());
            buttonClose3.addEventListener("click", () => {
                modalTerceiro.close();
                resetarFormularioCampanha();
            });
            
        } else if (camposSemCampanha) {
            
            controle = false
            btnConcluir.setAttribute("type", "submit");
            document.getElementById("produtoForm").addEventListener("submit", handleSubmit);
        } 
    });


    



    async function handleSubmit(event) {
        event.preventDefault();
        
    
        let nome = document.getElementById('Produto').value;
        let descricao = document.getElementById('Descricao').value;
        let quantidade = document.getElementById('Quantidade').value;
        quantidade = quantidade.replace(/\./g, '');
        quantidade = parseInt(quantidade);
    
        let preco = document.getElementById('Preco').value;
        preco = preco.replace(/\./g, '');
        preco = parseInt(preco);
    
        let imagemInput = document.getElementById('imagem');
        let imagemFile = imagemInput.files[0];
    
        let idCampanha = null;
        let editarValor = null
        editarValor = document.getElementById("valorEditar").value;
           
        
        let editarValor2 = null
        editarValor2 = document.getElementById("valorEditar2").value;
        
    

        if (editarValor != null){
            idCampanha = editarValor
        }else if (editarValor2 != null){
            idCampanha = editarValor2
        }

    
        if (controle){
            let checkboxes = document.getElementsByClassName('listaCampanha');
        
            for (let i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    idCampanha = checkboxes[i].value;
                    break;
                }
    
            }
        }


    
        let fisico = document.getElementById("Fisico");
        let virtual = document.getElementById("Virtual");
        let tipo = "";
    
        if (fisico.checked) {
            tipo = "Físico";
        } else if (virtual.checked) {
            tipo = "Virtual";
        } else {
            tipo = null;
        }
   
        const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
 
        // Criação do formData para envio com imagem
        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("descricao", descricao);
        formData.append("valor", preco);
        formData.append("quantidade", quantidade);
        formData.append("tipo", tipo);
        formData.append("idCampanha", idCampanha);
        formData.append("is_active", true);
    
        if (imagemFile) {
            formData.append("img1", imagemFile);
        }
        
        let response;
        let textPopupAlerta;
        const loadingPopup = new Popup();
        if (editarValor2) {
            // Atualização via PUT — mas precisa ver se seu back aceita multipart no PUT
            loadingPopup.showLoadingPopup('Atualizando dados...');
            textPopupAlerta = 'atualizar'
            response = await fetch(`/api/produto/${editarValor2}/`, {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrf
                    // sem Content-Type
                },
                body: formData
            });
            
            editarValor2 = null

        } else if (editarValor) {
            
            // Atualização via PUT — mas precisa ver se seu back aceita multipart no PUT
            loadingPopup.showLoadingPopup('Atualizando dados...');
            textPopupAlerta = 'atualizar'
            response = await fetch(`/api/produto/${editarValor}/`, {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrf
                    // sem Content-Type
                },
                body: formData
            });
            editarValor = null
        
        
        
        }else {
            // Cadastro via POST com FormData e imagem
            loadingPopup.showLoadingPopup('Cadastrando produto...');
            textPopupAlerta = 'cadastrar'
            response = await fetch('/api/produto/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrf
                    // sem Content-Type
                },
                body: formData
            });

        }
        loadingPopup.hidePopup();
        const popupAlert = new Popup();
        if (!response.ok) {
            popupAlert.showPopup("Erro ao "+textPopupAlerta+" produto", "Erro", "erro");
        } else {
            popupAlert.showPopup("Sucesso ao "+textPopupAlerta+" produto", "Sucesso", "sucesso");
            popupAlert.imgClosed.addEventListener("click", () => {
                window.location.reload();
            });
        }
    }

        
   
    

    async function EventoCampanhas(event) {
        event.preventDefault();
        let nomeInput = document.getElementById('nomeCampanha')
        let nome = nomeInput.value;
        let inicio = new Date(); // pega o momento atual
        inicio.setHours(0, 0, 0, 0);
        // let inicio = new Date(document.getElementById('dataInicio').value + "T00:00:00"); // Garante o horário correto
        let dataFimInput = document.getElementById('dataFim');
        let fim = new Date(dataFimInput.value + "T00:00:00");
        let status = document.getElementById('ativaCampanha').checked; 
        // let descricaoCampanha = document.getElementById('descricaoCampanha').value;
        const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value

        const alertPopup = new Popup();

        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0);

        
        let Valid = true;

        // Validação do nome
        if (nome.trim() === "") {
            ShowError(nomeInput, "Campo obrigatório");
            Valid = false;
        } else {
            ShowSucesso(nomeInput);
        }

        // Validação da data
        if (dataFimInput.value === "") {
            ShowError(dataFimInput, "Campo obrigatório");
            Valid = false;
        } else if (fim < inicio) {
            ShowError(dataFimInput, "A data final precisa ser hoje ou depois.");
            Valid = false;
        } else {
            ShowSucesso(dataFimInput);
        }

        if (!Valid) return;

        const evento = {
            nome: nome,
            is_active: status,
            dataInicio: inicio.toISOString().split('T')[0],
            dataFim: dataFim.value
        };

        let valorCampanhaId = document.getElementById('valorEditar').value;
        
        let formCampanhaTerceiro = document.getElementById('CriacaoDeCampanhaForm');

        let response
        let textPopupAlert = ""
        if (valorCampanhaId) {
            textPopupAlert = "Campanha alterada com sucesso!"
            response = await apiRequest(`/api/campanha/${valorCampanhaId}/`, 'PUT', evento, { 'X-CSRFToken': csrf });
        } else {
            textPopupAlert = "Campanha cadastrada com sucesso!"
            response = await apiRequest('/api/campanha/', 'POST', evento, { 'X-CSRFToken': csrf });
            let novaCampanha = document.createElement("div");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("listaCampanha");
            checkbox.value = response.id;

            let label = document.createElement("label");
            label.textContent = response.nome;

            novaCampanha.appendChild(checkbox);
            novaCampanha.appendChild(label);
            campanhaLista.appendChild(novaCampanha);

            modalTerceiro.close();
            formCampanhaTerceiro.reset();

        }
        
        if (window.location.href.includes("campanhas")) {
            // alert popup de sucesso na pagina campanhas
            alertPopup.showPopup(textPopupAlert, "Sucesso", "sucesso");
            alertPopup.imgClosed.addEventListener("click", () => {
                window.location.reload();
            })
        }else{
            // alert popup de sucesso na pagina adm
            alertPopup.showPopup(textPopupAlert, "Sucesso", "sucesso");
        }

        // if (window.location.href.includes("campanhas")) { isso funciona 
        //     window.location.reload();
        // }
    }

    document.getElementById("CriacaoDeCampanhaForm").addEventListener("submit", EventoCampanhas);

    // Delegação de evento para checkboxes do segundo popup
    modalSegundo.addEventListener("change", function (event) {
        if (event.target.type === "checkbox") {
            let checkboxes = modalSegundo.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(cb => cb.checked = cb === event.target);
        }
    });


    document.getElementById("imagem").addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadBox = document.querySelector(".UploadBox");
                uploadBox.classList.add("has-image");
                uploadBox.style.backgroundImage = `url(${e.target.result})`;
                uploadBox.style.backgroundSize = "contain";
                uploadBox.style.backgroundRepeat = "no-repeat";
                uploadBox.style.backgroundPosition = "center";
            };
            reader.readAsDataURL(file);
        }
    });



    
    [modalPrimeiro, modalSegundo, modalTerceiro].forEach(modal => {
        modal.addEventListener("click", (event) => {
            const dialogDimensions = modal.getBoundingClientRect();
            if (
                event.clientX < dialogDimensions.left ||
                event.clientX > dialogDimensions.right ||
                event.clientY < dialogDimensions.top ||
                event.clientY > dialogDimensions.bottom
            ) {
                modal.close();

                // Se quiser resetar os formulários ao fechar:
                if (modal === modalPrimeiro) resetarFormularioProduto();
                if (modal === modalTerceiro) resetarFormularioCampanha();
            }
        });
    });

});


function mascaraMilhar(input) {
    // Remove tudo que não for número
    let valor = input.value.replace(/\D/g, "");

    // Impede zero no começo (só se tiver mais de 1 dígito)
    if (valor.length > 1 && valor.startsWith("0")) {
        valor = valor.replace(/^0+/, "");
    }

    // Aplica separador de milhar
    valor = valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");


    input.value = valor;
}

function bloqueiaCaracteresIndesejados(event) {
    // Bloqueia vírgula, ponto digitado, sinais etc.
    const caracteresBloqueados = [",", ".", "-", "+", "e"]; // "e" evita casos tipo 1e10
    if (caracteresBloqueados.includes(event.key)) {
        event.preventDefault();
        return false;
    }

}

