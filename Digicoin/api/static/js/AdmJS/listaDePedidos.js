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

document.addEventListener('DOMContentLoaded', function () {
    const botoes = document.querySelectorAll('#botaoConcluir');

    botoes.forEach(botao => {
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
});

