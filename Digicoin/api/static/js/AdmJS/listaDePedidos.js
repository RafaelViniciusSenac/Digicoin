function toggleItens(id) {
    const el = document.getElementById('itens-' + id);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}

async function atulizarPedido(idPedido) {
    try {
        let response = await fetch(`/api/compra/${idPedido}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ pedido: "Concluído" })
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
        botao.addEventListener('click', function (event) {
            // Sobe até a div com a classe 'itensCompra-listaDePedidos'
            const divPai = event.target.closest('.itensCompra-listaDePedidos');
            if (divPai) {
                const idCompra = divPai.id.replace('itens-', '');
                console.log('ID da compra:', idCompra);

                atulizarPedido(idCompra);
                window.location.reload();
                    
            }
        });
    });
});
