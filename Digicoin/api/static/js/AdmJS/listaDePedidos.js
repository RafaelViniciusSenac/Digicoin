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
            console.log('Pedido concluído com sucesso!');
        } else {
            console.error('Erro ao concluir o pedido:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

<<<<<<< Updated upstream
// FUNÇÃO ATUALIZADA: Agora recebe 'nomeCliente'
async function inativarPedido(idPedido, elementoLinha, nomeCliente) {
    // 1. CONFIRMAÇÃO DA AÇÃO usando o nome do cliente
    const confirmado = await confirmarAcao(
        `Deseja realmente excluir o pedido do cliente ${nomeCliente}? Esta ação é irreversível!`,
        'Confirmação de exclusão'
    );

    if (!confirmado) {
        return; // Sai da função se o usuário cancelar
    }

    // Opcional: Mostrar popup de carregamento enquanto a API é chamada
    showLoadingPopup(`Inativando pedido de ${nomeCliente}...`); 

    try {
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'DELETE', 
=======
// NOVO CÓDIGO: Função para Inativar/Excluir o Pedido
async function inativarPedido(idPedido, elementoLinha) {
    if (!confirm(`Tem certeza que deseja INATIVAR/EXCLUIR o pedido ID ${idPedido}? Esta ação pode ser irreversível!`)) {
        return; // Sai da função se o usuário cancelar
    }

    try {
        // ASSUMIMOS O MÉTODO 'DELETE' para a ação de lixeira.
        // Se a sua API usa 'PATCH' para mudar o status para 'inativo', mude o method e body.
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'DELETE', // Método ideal para exclusão
>>>>>>> Stashed changes
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

<<<<<<< Updated upstream
        // Oculta o popup de carregamento antes de mostrar o resultado
        const loadingDialog = document.querySelector(".popup-loading");
        if (loadingDialog) loadingDialog.remove(); 
        document.body.classList.remove('no-scroll-popup-alerta');
        
        if (response.ok || response.status === 204) { 
            // 2. FEEDBACK DE SUCESSO
            showPopup(`O Pedido do usuário ${nomeCliente} foi excluído com sucesso!`, 'Sucesso', 'sucesso');
=======
        if (response.ok || response.status === 204) { // 204 No Content é comum para DELETE
            alert(`Pedido ID ${idPedido} inativado/excluído com sucesso!`);
>>>>>>> Stashed changes
            
            // Remove a linha da lista para atualizar a UI imediatamente
            elementoLinha.remove(); 
            
<<<<<<< Updated upstream
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
=======
            // Opcional: window.location.reload(); // Se preferir recarregar a página
        } else {
            const erroData = await response.json();
            console.error('Erro ao inativar o pedido:', erroData);
            alert(`Erro ${response.status} ao inativar o pedido: ${JSON.stringify(erroData)}`);
        }
    } catch (error) {
        console.error('Erro na requisição de inativação:', error);
        alert('Ocorreu um erro de rede ao tentar inativar o pedido.');
>>>>>>> Stashed changes
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const botoesConcluir = document.querySelectorAll('#botaoConcluir');
<<<<<<< Updated upstream
    const botoesInativar = document.querySelectorAll('.btn-inativar-pedido'); 

    // Lógica para Concluir Pedido (inalterada)
=======
    const botoesInativar = document.querySelectorAll('.btn-inativar-pedido'); // NOVO: Seleciona os botões de inativação

    // Lógica para Concluir Pedido (já existente)
>>>>>>> Stashed changes
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

            if (obsInput) {
                const obsEntrega = obsInput.value;
                console.log('existe obs:' + obsEntrega);
                atulizarPedido(idCompra, obsEntrega);
            } else {
                console.log('não existe');
                atulizarPedido(idCompra);
            }

            // Mantenha o reload aqui se for o comportamento esperado após concluir
            window.location.reload(); 
        });
    });

<<<<<<< Updated upstream
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
=======
    // NOVO CÓDIGO: Lógica para Inativar Pedido
    botoesInativar.forEach(botao => {
        botao.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Garante que o evento da linha não seja disparado

            const idCompra = botao.getAttribute('data-id');
            const linhaPedido = botao.closest('.linha-listaDePedidos'); // Elemento a ser removido

            if (idCompra && linhaPedido) {
                inativarPedido(idCompra, linhaPedido);
>>>>>>> Stashed changes
            }
        });
    });
});