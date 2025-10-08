function toggleItens(id) {
// ... (código inalterado)
    const el = document.getElementById('itens-' + id);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

async function atulizarPedido(idPedido, obsEntrega=null) {
// ... (código inalterado)
    let dados = { pedido: "Concluído" };
    if(obsEntrega){
        dados = { obsEntrega: obsEntrega };
    }
    try {
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

// FUNÇÃO ATUALIZADA: Agora recebe 'nomeCliente'
async function inativarPedido(idPedido, elementoLinha, nomeCliente) {
    // 1. CONFIRMAÇÃO DA AÇÃO usando o nome do cliente
    const confirmado = await confirmarAcao(
        `Deseja realmente excluir o pedido do usuário ${nomeCliente}? Esta ação pode ser irreversível!`,
        'Confirmação de Inativação'
    );

    if (!confirmado) {
        return; // Sai da função se o usuário cancelar
    }

    // Opcional: Mostrar popup de carregamento enquanto a API é chamada
    showLoadingPopup(`Inativando pedido de ${nomeCliente}...`); 

    try {
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'DELETE', 
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        // Oculta o popup de carregamento antes de mostrar o resultado
        const loadingDialog = document.querySelector(".popup-loading");
        if (loadingDialog) loadingDialog.remove(); 
        document.body.classList.remove('no-scroll-popup-alerta');
        
        if (response.ok || response.status === 204) { 
            // 2. FEEDBACK DE SUCESSO
            showPopup(`O Pedido do usuário ${nomeCliente} foi excluído com sucesso!`, 'Sucesso', 'sucesso');
            
            // Remove a linha da lista para atualizar a UI imediatamente
            elementoLinha.remove(); 
            
        } else {
            const erroData = response.status === 404 ? { detail: 'Recurso não encontrado.' } : await response.json();
            console.error('Erro ao inativar o pedido:', erroData);
            
            // 3. FEEDBACK DE ERRO
            showPopup(
                `Não foi possível inativar o pedido de **${nomeCliente}**. Erro: ${response.status} - ${erroData.detail || response.statusText}`, 
                'Erro na Inativação', 
                'erro'
            );
        }
    } catch (error) {
        // Certifica-se de fechar o loading em caso de erro de rede
        const loadingDialog = document.querySelector(".popup-loading");
        if (loadingDialog) loadingDialog.remove(); 
        document.body.classList.remove('no-scroll-popup-alerta');
        
        console.error('Erro na requisição de inativação:', error);
        // 4. FEEDBACK DE ERRO GERAL
        showPopup('Ocorreu um erro de rede ao tentar inativar o pedido. Tente novamente.', 'Erro de Conexão', 'erro');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const botoesConcluir = document.querySelectorAll('#botaoConcluir');
    const botoesInativar = document.querySelectorAll('.btn-inativar-pedido'); 

    // Lógica para Concluir Pedido (inalterada)
    botoesConcluir.forEach(botao => {
        const divPai = botao.closest('.itensCompra-listaDePedidos');
        const obsInput = divPai.querySelector('.obsEntrega');

        if (obsInput) {
            // Desativa o botão inicialmente
            botao.disabled = true;

            // Adiciona evento para ativar o botão quando o campo for preenchido
            obsInput.addEventListener('input', function () {
                botao.disabled = obsInput.value.trim() === '';
            });
        }

        botao.addEventListener('click', function (event) {
            const idCompra = divPai.id.replace('itens-', '');
            console.log('ID da compra:', idCompra);
            let retornar;
            if (obsInput) {
                const obsEntrega = obsInput.value;
                console.log('existe obs:' + obsEntrega);
                retornar = atulizarPedido(idCompra, obsEntrega);
            } else {
                console.log('não existe');
                retornar = atulizarPedido(idCompra);
            }

            // Mantenha o reload aqui se for o comportamento esperado após concluir
            if (retornar) {
                const popupAlert = new Popup();
                popupAlert.showPopup('Pedido concluído com sucesso!', 'Sucesso', 'sucesso');
                popupAlert.imgClosed.addEventListener("click", () => {
                    window.location.reload(); 
                });
            }else{
                showPopup('Erro ao concluir o pedido. Tente novamente.', 'Erro', 'erro');
            }
        });
    });

    // Lógica para Inativar Pedido (ATUALIZADA para capturar o nome)
    botoesInativar.forEach(botao => {
        botao.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); 

            const idCompra = botao.getAttribute('data-id');
            const nomeCliente = botao.getAttribute('data-nome'); // NOVO: Captura o nome do cliente
            const linhaPedido = botao.closest('.linha-listaDePedidos'); 

            if (idCompra && nomeCliente && linhaPedido) {
                // NOVO: Passa o nome do cliente para a função
                inativarPedido(idCompra, linhaPedido, nomeCliente);
            }
        });
    });
});