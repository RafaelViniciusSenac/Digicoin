import Popup from '../popup.js';

function desativarEnderecoForm(acao) {
    const enderecoForm = document.getElementById('endereco');
    if (acao) {
        const camposForms = enderecoForm.querySelectorAll('input, select');
        [].forEach.call(camposForms, function (el) {
            el.setAttribute('disabled', 'disabled');
        });
        enderecoForm.classList.remove('form-endereco-ativo');
        enderecoForm.classList.add('form-endereco-desativado');
    } else {

        // ativa inputs e selects
        const camposForms = enderecoForm.querySelectorAll('input, select');
        [].forEach.call(camposForms, function (el) {
            el.removeAttribute('disabled');
        });
        enderecoForm.classList.remove('form-endereco-desativado');
        enderecoForm.classList.add('form-endereco-ativo');
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
    }else{
        console.log('Produto virtual');
        dadosCompra['entrega'] = 'Retirar';
    }
    dadosCompra['idUsuario'] = 1;

    const storedData = JSON.parse(localStorage.getItem('listaProdutos')) || {};
    const grid = storedData.listaGrid || [];
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value
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

    // Enviar dados para a API
    try {
        const response = await apiRequest('/api/cadastrarCompra/', 'POST', dadosParaApi, {'X-CSRFToken':csrf});
        console.log(response.status);
        if (response.status == 201) {
            localStorage.removeItem('listaProdutos');
            // limpa o grid
            const grid = document.getElementById('itensGrid');
            grid.innerHTML = '';

            // remove o popup
            const popup = new Popup();
            popup.hidePopup();

            // limpa o total
            const total = document.getElementById('valorTotal');
            total.innerHTML = '0';
    
            // redireciona para a home
            //window.location.href = '/home/';
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
        const body = `<form class="form" id="formTipoEntraga"> 
        
        <label class="input-label">Selecione o tipo de entrega</label>
        <div class="form-group">
            <div class="input-container">
                <label>
                    <input checked class="input-radio" id="option1" type="radio" name="entrega" value="Retirar">
                    Retirar na Digix
                </label>
            </div>
            <div class="input-container">
                <label>
                    <input class="input-radio" id="option2" type="radio" name="entrega" value="Entrega">
                    Entregar no endereço
                </label>
            </div>
        </div>
        <div class="form-endereco-desativado" id="endereco">
            <span class="obs"><span class="asterisco">*</span> Campos obrigatórios</span>
            <div class="form-group">
                <div class="input-container">
                    <label for="cep">Cep<span class="asterisco">*</span></label>
                    <input
                        class="input-text required"
                        type="text"
                        name="cep"
                        id="cep"
                        disabled
                    />
                </div>
            </div>
            <div class="form-group">
                <div class="input-container">
                    <label for="cidade">Cidade<span class="asterisco">*</span></label>
                    <input
                        class="input-text required"
                        type="text"
                        name="cidade"
                        id="cidade"
                        disabled
                    />
                </div>
                <div class="input-container">
                    <label for="estado">Estado<span class="asterisco">*</span></label>
                    <select disabled class="input-select required" name="estado" id="estado">
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
            <div class="form-group">
                <div class="input-container">
                    <label for="bairro">Bairro<span class="asterisco">*</span></label>
                    <input
                        class="input-text required"
                        type="text"
                        name="bairro"
                        id="bairro"
                        disabled
                    />
                </div>
            </div>
            <div class="form-group">
                <div class="input-container">
                    <label for="rua">Rua<span class="asterisco">*</span></label>
                   <input
                        class="input-text required"
                        type="text"
                        name="rua"
                        id="rua"
                        disabled
                    />
                </div>
            </div>
            <div class="form-group">
                <div class="input-container">
                    <label for="numero">Número<span class="asterisco">*</span></label>
                    <input
                        class="input-text required"
                        type="text"
                        name="numero"
                        disabled
                    />
                </div>
                <div class="input-container">
                    <label for="complemento">Complemento</label>
                    <input
                        class="input-text"
                        type="text"
                        name="complemento"
                        disabled
                    />
                </div>
            </div>
        </div>
        <div class="form-group">
            <button class="input-button" type="submit" id="botaoConcluirPedido">Concluir Pedido</button>
        </div>
        </form>`;

        popup.showPopup(body, titulo);

        // Usar MutationObserver para associar eventos onclick após o popup ser exibido
        const observer = new MutationObserver(() => {
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
                observer.disconnect(); // Desconectar o observer após encontrar os elementos
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
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
        if(temProdutosFisicos){
            abrirPopup();
        }else{
            enviarDadosParaApi();
        }
    });
});