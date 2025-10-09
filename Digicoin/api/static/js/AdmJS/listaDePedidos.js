function toggleItens(id) {
    const el = document.getElementById('itens-' + id);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

async function atulizarPedido(idPedido, obsEntrega = null) {
    const confirmado = await confirmarAcao('Deseja realmente concluir este pedido?', 'Confirmação de Conclusão');
    
    if (!confirmado) {
        return null; // Retorna null se cancelado
    }

    let dados = { 
        pedido: "Concluído" 
    };
    if (obsEntrega) {
        dados.obsEntrega = obsEntrega;
    }
    const popupLoading = new Popup(); 
    popupLoading.showLoadingPopup(`Concluindo pedido...`);
    
    try {
        const response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(dados)
        });
        popupLoading.hidePopup();
        if (response) {
            return true; // Retorna true ou false
        } else {
            return false;
        }
    } catch (error) {
        console.error("Erro na requisição de atualização:", error);
        return false; // Retorna false em caso de erro
    }
}

// A função inativarPedido permanece inalterada
async function inativarPedido(idPedido, elementoLinha, nomeCliente) {
    const confirmado = await confirmarAcao(
        `Deseja realmente excluir o pedido do usuário ${nomeCliente}? Esta ação pode ser irreversível!`,
        'Confirmação de Inativação'
    );

    if (!confirmado) {
        return; 
    }

    showLoadingPopup(`Inativando pedido de ${nomeCliente}...`); 

    try {
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'DELETE', 
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        const popup = new Popup();
        popup.hidePopup();
        
        if (response.ok || response.status === 204) { 
            showPopup(`O Pedido do usuário ${nomeCliente} foi excluído com sucesso!`, 'Sucesso', 'sucesso');
            elementoLinha.remove(); 
            
        } else {
            const erroData = response.status === 404 ? { detail: 'Recurso não encontrado.' } : await response.json();
            console.error('Erro ao inativar o pedido:', erroData);
            showPopup(
                `Não foi possível inativar o pedido de **${nomeCliente}**. Erro: ${response.status} - ${erroData.detail || response.statusText}`, 
                'Erro na Inativação', 
                'erro'
            );
        }
    } catch (error) {
        const popup = new Popup();
        popup.hidePopup();
        console.error('Erro na requisição de inativação:', error);
        showPopup('Ocorreu um erro de rede ao tentar inativar o pedido. Tente novamente.', 'Erro de Conexão', 'erro');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const botoesConcluir = document.querySelectorAll('#botaoConcluir');
    const botoesInativar = document.querySelectorAll('.btn-inativar-pedido'); 

    botoesConcluir.forEach(botao => {
        const divPai = botao.closest('.itensCompra-listaDePedidos');
        const obsInput = divPai.querySelector('.obsEntrega');

        if (obsInput) {
            botao.disabled = true;
            obsInput.addEventListener('input', function () {
                botao.disabled = obsInput.value.trim() === '';
            });
        }

        botao.addEventListener('click', async function (event) { 
            const idCompra = divPai.id.replace('itens-', '');
            
            let resultado; 
            if (obsInput) {
                const obsEntrega = obsInput.value;
                resultado = await atulizarPedido(idCompra, obsEntrega);
            } else {
                resultado = await atulizarPedido(idCompra);
            }

            if (resultado === true) {
                // Sucesso
                showPopup('Pedido concluído com sucesso!', 'Sucesso', 'sucesso', 
                    () => window.location.reload(),
                    () => window.location.reload()
                );
                document.querySelector('.popup-alerta-fechar').addEventListener('click', () => window.location.reload());
            } else if (resultado === false) {
                // Erro
                showPopup('Erro ao concluir o pedido. Tente novamente.', 'Erro', 'erro');
            }
            // Se resultado for null (cancelado), o código termina e nada mais acontece.
        });
    });

    // A lógica para Inativar Pedido já estava correta
    botoesInativar.forEach(botao => {
        botao.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); 

            const idCompra = botao.getAttribute('data-id');
            const nomeCliente = botao.getAttribute('data-nome');
            const linhaPedido = botao.closest('.linha-listaDePedidos'); 

            if (idCompra && nomeCliente && linhaPedido) {
                inativarPedido(idCompra, linhaPedido, nomeCliente);
            }
        });
    });
});