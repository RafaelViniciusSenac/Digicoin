function toggleItens(id) {
    const el = document.getElementById('itens-' + id);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

async function atulizarPedido(idPedido, obsEntrega=null) {
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
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        if (response.ok || response.status === 204) { // 204 No Content é comum para DELETE
            alert(`Pedido ID ${idPedido} inativado/excluído com sucesso!`);
            
            // Remove a linha da lista para atualizar a UI imediatamente
            elementoLinha.remove(); 
            
            // Opcional: window.location.reload(); // Se preferir recarregar a página
        } else {
            const erroData = await response.json();
            console.error('Erro ao inativar o pedido:', erroData);
            alert(`Erro ${response.status} ao inativar o pedido: ${JSON.stringify(erroData)}`);
        }
    } catch (error) {
        console.error('Erro na requisição de inativação:', error);
        alert('Ocorreu um erro de rede ao tentar inativar o pedido.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const botoesConcluir = document.querySelectorAll('#botaoConcluir');
    const botoesInativar = document.querySelectorAll('.btn-inativar-pedido'); // NOVO: Seleciona os botões de inativação

    // Lógica para Concluir Pedido (já existente)
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

            window.location.reload();
        });
    });

    // NOVO CÓDIGO: Lógica para Inativar Pedido
    botoesInativar.forEach(botao => {
        botao.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation(); // Garante que o evento da linha não seja disparado

            const idCompra = botao.getAttribute('data-id');
            const linhaPedido = botao.closest('.linha-listaDePedidos'); // Elemento a ser removido

            if (idCompra && linhaPedido) {
                inativarPedido(idCompra, linhaPedido);
            }
        });
    });
});