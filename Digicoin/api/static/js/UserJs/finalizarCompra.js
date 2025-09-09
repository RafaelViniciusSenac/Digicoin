let popupFinalizarCompra;
function desativarEnderecoForm(acao) {
    const enderecoForm = document.getElementById('endereco');
    if (acao) {
        const camposForms = enderecoForm.querySelectorAll('input, select');
        [].forEach.call(camposForms, function (el) {
        el.setAttribute('disabled', 'disabled');
        });
        enderecoForm.classList.remove('form-endereco-ativo-carrinhoCompras');
        enderecoForm.classList.add('form-endereco-desativado-carrinhoCompras');
        const camposObrigatorios = enderecoForm.querySelectorAll('.required');
        camposObrigatorios.forEach(campo => {
            campo.classList.remove('campo-invalido-carrinhoCompras');
        });
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
    //dadosCompra['idUsuario'] = 1;
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
    const response = await apiRequest('/api/cadastrarCompra/', 'POST', dadosParaApi, {'X-CSRFToken': csrf});
    if (response && response.status === 201) {
        localStorage.removeItem('listaProdutos');
        const grid = document.getElementById('itensGrid');
        grid.innerHTML = '';
        popupFinalizarCompra.hidePopup();
        const total = document.getElementById('valorTotal');
        total.innerHTML = '0';
        // Mostrar mensagem de sucesso
        const popupSucesso = new Popup();
        popupSucesso.showPopup("Compra realizada com sucesso!","Sucesso","sucesso");

        // Redirecionar para outra página quando clicar no botão de fechar da popup
        popupSucesso.imgClosed.addEventListener("click", () => {
            window.location.href = '/home';
        });

    } else {
        let erros = '';
        for (const error in response.error) {
            erros += `${parseInt(error)+1}: ${response.error[error]}<br>`;
        }
        console.log(response.error);
        const popupErro = new Popup();
        popupErro.showPopup("Erro ao realizar compra!<br><br>" + erros,"Error","erro");
    }
}

function validarFormulario(form) {
    let valido = true;
    const tipoEntrega = form.querySelector('input[name="entrega"]:checked').value;

    const camposObrigatorios = form.querySelectorAll('.required');
    camposObrigatorios.forEach(campo => {
        campo.classList.remove('campo-invalido-carrinhoCompras');

        // Se for campo de endereço e tipo for "Retirar", ignora
        if (tipoEntrega === 'Retirar' && campo.closest('#endereco')) return;

        if (!campo.value.trim()) {
            campo.classList.add('campo-invalido-carrinhoCompras');
            valido = false;
        }
    });

    return valido;
}

document.addEventListener("DOMContentLoaded", () => {
    popupFinalizarCompra = new Popup();
    function abrirPopup() {
        const titulo = 'Finalizar Pedido';
        const body = `
        <form class="form-carrinhoCompras" id="formTipoEntraga">
            <span class="obs-carrinhoCompras"><span class="asterisco-carrinhoCompras">*</span> Campos obrigatórios</span>
            <div class="form-local-tipo-carrinhoCompras">
                <div class="form-group-carrinhoCompras">
                    <div class="input-label-carrinhoCompras">
                        <label for="entrega">Selecione o tipo de entrega<span class="asterisco-carrinhoCompras">*</span></label>
                    </div>
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
            </div>
            <div class="form-endereco-desativado-carrinhoCompras" id="endereco">
                <div class="form-group-carrinhoCompras">
                    <div class="input-container-carrinhoCompras">
                        <label for="cep">Cep<span class="asterisco-carrinhoCompras">*</span></label>
                        <input class="input-text-carrinhoCompras required" type="text" name="cep" id="cep" disabled maxlength="9" />
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
                        <input class="input-text-carrinhoCompras required" type="text" name="numero" id="numero" disabled />
                    </div>
                    <div class="input-container-carrinhoCompras">
                        <label for="complemento">Complemento</label>
                        <input class="input-text-carrinhoCompras" type="text" name="complemento" id="complemento" disabled />
                    </div>
                </div>
            </div>
            <div class="form-group-carrinhoCompras">
                <button class="input-button-carrinhoCompras" type="submit" id="botaoConcluirPedido">Concluir Pedido</button>
            </div>
        </form>`;

        popupFinalizarCompra.showPopup(body, titulo);

        // Eventos após exibir popup
        const option1 = document.getElementById('option1');
        const option2 = document.getElementById('option2');
        const cepInput = document.getElementById('cep');
        const form = document.getElementById('formTipoEntraga');
        const submitButton = document.getElementById('botaoConcluirPedido');

        if (option1 && option2 && cepInput && submitButton) {
            option1.onclick = () => desativarEnderecoForm(true);
            option2.onclick = () => desativarEnderecoForm(false);

            // Busca automática de CEP ao digitar
            let cepAnterior = '';
            cepInput.addEventListener('input', () => {
                const cep = cepInput.value.replace(/\D/g, '');
                if (cep.length === 8 && cep !== cepAnterior) {
                    cepAnterior = cep;
                    buscarEndereco('cep', 'rua', 'bairro', 'cidade', 'estado');
                }
            });

            form.onsubmit = (event) => {
                event.preventDefault();
                // Valida antes de enviar
                if (validarFormulario(form)) {
                    enviarDadosParaApi(form);
                } else {
                    const popupErro = new Popup();
                    popupErro.showPopup("Preencha todos os campos obrigatórios.","Erro","erro");
                }
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
