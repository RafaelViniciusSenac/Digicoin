class Popup {
    constructor() {
        this.overlay = null;
        this.popup = null;
        this.popupHeader = null;
        this.popupTitulo = null;
        this.imgClosed = null;
        this.popupBody = null;
    }

    showPopup(conteudo, titulo = ' ') {
        this.removeOldPopup();
        this.createElements();
        this.setAttributes();
        this.appendElements();
        this.popupTitulo.innerHTML = titulo;
        this.popupBody.innerHTML = conteudo;
        this.overlay.style.display = "flex";
        document.body.classList.add('no-scroll-carrinhoCompras');
    }

    hidePopup() {
        this.removeOldPopup();
        document.body.classList.remove('no-scroll-carrinhoCompras');
    }

    removeOldPopup() {
        const oldPopup = document.querySelector(".overlay-carrinhoCompras");
        if (oldPopup) {
            oldPopup.remove();
        }
    }

    createElements() {
        this.overlay = document.createElement("div");
        this.popup = document.createElement("div");
        this.popupHeader = document.createElement("div");
        this.popupTitulo = document.createElement("div");
        this.imgClosed = document.createElement("img");
        this.popupBody = document.createElement("div");
    }

    setAttributes() {
        this.overlay.className = "overlay-carrinhoCompras";
        this.popup.className = "popup-carrinhoCompras";
        this.popupHeader.className = "popup-header-carrinhoCompras";
        this.popupTitulo.className = "popup-titulo-carrinhoCompras";
        this.imgClosed.className = "popup-closed-carrinhoCompras";
        this.imgClosed.src = imgFecharPopupSrc;
        this.imgClosed.alt = "Fechar";
        this.imgClosed.addEventListener("click", () => this.hidePopup());
        this.popupBody.className = "popup-body-carrinhoCompras";
    }

    appendElements() {
        this.popupHeader.appendChild(this.popupTitulo);
        this.popupHeader.appendChild(this.imgClosed);
        this.popup.appendChild(this.popupHeader);
        this.popup.appendChild(this.popupBody);
        this.overlay.appendChild(this.popup);
        document.body.appendChild(this.overlay);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const popupInstance = new Popup();
        popupInstance.hidePopup();
    }
});

function desativarEnderecoForm(acao) {
    const enderecoForm = document.getElementById('endereco');
    if (acao) {
        const camposForms = enderecoForm.querySelectorAll('input, select');
        [].forEach.call(camposForms, function (el) {
        el.setAttribute('disabled', 'disabled');
        });
        enderecoForm.classList.remove('form-endereco-ativo-carrinhoCompras');
        enderecoForm.classList.add('form-endereco-desativado-carrinhoCompras');
    } else {
        const camposForms = enderecoForm.querySelectorAll('input, select');
        [].forEach.call(camposForms, function (el) {
        el.removeAttribute('disabled');
        });
        enderecoForm.classList.remove('form-endereco-desativado-carrinhoCompras');
        enderecoForm.classList.add('form-endereco-ativo-carrinhoCompras');
    }
}

async function enviarDadosParaApi(form = null) {
    let dadosCompra = {};
    let itensCompra = [];
    if (form != null) {
        const DadosFormulario = new FormData(form);
        DadosFormulario.forEach((value, key) => {
        dadosCompra[key] = value;
        });
    } else {
        console.log('Produto virtual');
        dadosCompra['entrega'] = 'Retirar';
    }
    dadosCompra['idUsuario'] = 1;
    const storedData = JSON.parse(localStorage.getItem('listaProdutos')) || {};
    const grid = storedData.listaGrid || [];
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    let totalProduto = 0;
    grid.forEach(item => {
        totalProduto += parseInt(item.valorProduto) * parseInt(item.qtdProduto);
        itensCompra.push({
        qtdProduto: item.qtdProduto || 1,
        idProduto: item.idProduto
        });
    });
    dadosCompra['total'] = totalProduto;
    const dadosParaApi = {
        compra: dadosCompra,
        itens: itensCompra
    };
    try {
        const response = await apiRequest('/api/cadastrarCompra/', 'POST', dadosParaApi, {'X-CSRFToken':csrf});
        console.log(response.status);
        if (response.status == 201) {
            localStorage.removeItem('listaProdutos');
            const grid = document.getElementById('itensGrid');
            grid.innerHTML = '';
            const popup = new Popup();
            popup.hidePopup();
            const total = document.getElementById('valorTotal');
            total.innerHTML = '0';
            //mostrar mensagem de sucesso
            const popupSucesso = new Popup();
            popupSucesso.showPopup(`
            <div class="popup-sucesso-carrinhoCompras">
                <div class="popup-sucesso-header-carrinhoCompras">
                    <h2 class="popup-sucesso-titulo-carrinhoCompras">Compra realizada com sucesso!</h2>
                </div>
                <div class="popup-sucesso-body-carrinhoCompras">
                    <p class="popup-sucesso-texto-carrinhoCompras">Obrigado pela compra!</p>
                </div>
            </div>
            `);
            //redirecionar para outra página quando clicar no botao de fechar da popup
                
            popupSucesso.imgClosed.addEventListener("click", () => {
                window.location.href = '/home';
            });

            
        } else {
            console.log('erro ao cadastrar');
        }
    } catch (error) {
        console.log('Deu erro' + error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const popup = new Popup();
    function abrirPopup() {
        const titulo = 'Finalizar Pedido';
        const body = `<form class="form-carrinhoCompras" id="formTipoEntraga"> 
        <label class="input-label-carrinhoCompras">Selecione o tipo de entrega</label>
        <div class="form-group-carrinhoCompras">
            <div class="input-container-carrinhoCompras">
            <label>
                <input checked class="input-radio-carrinhoCompras" id="option1" type="radio" name="entrega" value="Retirar">
                Retirar na Digix
            </label>
            </div>
            <div class="input-container-carrinhoCompras">
            <label>
                <input class="input-radio-carrinhoCompras" id="option2" type="radio" name="entrega" value="Entrega">
                Entregar no endereço
            </label>
            </div>
        </div>
        <div class="form-endereco-desativado-carrinhoCompras" id="endereco">
            <span class="obs-carrinhoCompras"><span class="asterisco-carrinhoCompras">*</span> Campos obrigatórios</span>
            <div class="form-group-carrinhoCompras">
            <div class="input-container-carrinhoCompras">
                <label for="cep">Cep<span class="asterisco-carrinhoCompras">*</span></label>
                <input class="input-text-carrinhoCompras required" type="text" name="cep" id="cep" disabled />
            </div>
            </div>
            <div class="form-group-carrinhoCompras">
            <div class="input-container-carrinhoCompras">
                <label for="cidade">Cidade<span class="asterisco-carrinhoCompras">*</span></label>
                <input class="input-text-carrinhoCompras required" type="text" name="cidade" id="cidade" disabled />
            </div>
            <div class="input-container-carrinhoCompras">
                <label for="estado">Estado<span class="asterisco-carrinhoCompras">*</span></label>
                <select disabled class="input-select-carrinhoCompras required" name="estado" id="estado">
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                </select>
                </div>
                </div>
                <div class="form-group-carrinhoCompras">
                <div class="input-container-carrinhoCompras">
                    <label for="bairro">Bairro<span class="asterisco-carrinhoCompras">*</span></label>
                    <input class="input-text-carrinhoCompras required" type="text" name="bairro" id="bairro" disabled />
                </div>
                </div>
                <div class="form-group-carrinhoCompras">
                <div class="input-container-carrinhoCompras">
                    <label for="rua">Rua<span class="asterisco-carrinhoCompras">*</span></label>
                    <input class="input-text-carrinhoCompras required" type="text" name="rua" id="rua" disabled />
                </div>
                </div>
                <div class="form-group-carrinhoCompras">
                <div class="input-container-carrinhoCompras">
                    <label for="numero">Número<span class="asterisco-carrinhoCompras">*</span></label>
                    <input class="input-text-carrinhoCompras required" type="text" name="numero" disabled />
                </div>
                <div class="input-container-carrinhoCompras">
                    <label for="complemento">Complemento</label>
                    <input class="input-text-carrinhoCompras" type="text" name="complemento" disabled />
                </div>
                </div>
                </div>
                <div class="form-group-carrinhoCompras">
                <button class="input-button-carrinhoCompras" type="submit" id="botaoConcluirPedido">Concluir Pedido</button>
            </div>
        </form>`;
        popup.showPopup(body, titulo);
        // Associar eventos onclick após o popup ser exibido
        const option1 = document.getElementById('option1');
        const option2 = document.getElementById('option2');
        const onblurCep = document.getElementById('cep');
        const submitButton = document.getElementById('botaoConcluirPedido');
        const form = document.getElementById('formTipoEntraga');
        if (option1 && option2 && onblurCep && submitButton) {
            option1.onclick = () => desativarEnderecoForm(true);
            option2.onclick = () => desativarEnderecoForm(false);
            onblurCep.onblur = () => buscarEndereco('cep', 'rua', 'bairro', 'cidade', 'estado');
            form.onsubmit = (event) => {
                event.preventDefault(); // Prevenir o comportamento padrão do formulário
                enviarDadosParaApi(form);
            };
        }
    }

    document.getElementById('botaoFinalizarPedido').addEventListener('click', () => {
        const storedData = JSON.parse(localStorage.getItem('listaProdutos')) || {};
        const grid = storedData.listaGrid || [];

        let temProdutosFisicos = false;
        grid.forEach((item) => {
            if (item.fisicoProduto) {
            temProdutosFisicos = true;
            }
        });
        if (temProdutosFisicos) {
            abrirPopup();
        } else {
            enviarDadosParaApi();
        }
    });
});
