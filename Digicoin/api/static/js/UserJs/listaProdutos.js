document.addEventListener("DOMContentLoaded", function () {
    const produtos = document.getElementsByClassName("imgD-listaProdutos");
    const quantidadeMoedas = document.getElementById("quantidadeMoedas").value;

    for (let i = 0; i < produtos.length; i++) {
        produtos[i].children[0].addEventListener("click", function () {
            const idProduto = produtos[i].children[0].dataset.valor;
            const dialog = document.getElementById(`modal-${idProduto}`);
            const flipCard = document.getElementById(`flip-${idProduto}`);
            const refresh = flipCard.querySelector(".frente-listaProdutos .refresh-listaProdutos");
            const refresh2 = flipCard.querySelector(".tras-listaProdutos .refresh-listaProdutos");
            const fecharBtns = dialog.querySelectorAll(".fechar-listaProdutos");
            const adiquirirBtn = dialog.querySelector(".Adquirir-listaProdutos");
            const msgSaldoInsuficiente = dialog.querySelector(".msgSaldoInsuficiente-listaProdutos");

            //se quantidadeMoedas for menor que o valor do produto, desabilitar o botao de adiquirir
            if (quantidadeMoedas < produtos[i].children[0].dataset.valor) {
                adiquirirBtn.disabled = true;
                adiquirirBtn.style.opacity = 0.5;
                msgSaldoInsuficiente.style.display = "block";
            }
            adiquirirBtn.addEventListener("click", () => {
                const idProduto = adiquirirBtn.dataset.valor;
                const tipo = document.querySelector(`input[name="tipoProduto[${idProduto}]"]`)?.value || "";
                console.log(tipo);
                let fisicoPrduto = (tipo === "Físico");

                const produto = {
                    id: parseInt(idProduto),
                    idProduto: parseInt(idProduto),
                    nomeProduto: document.querySelector(`input[name="nomeProduto[${idProduto}]"]`)?.value || "",
                    valorProduto: parseInt(document.querySelector(`input[name="valorProduto[${idProduto}]"]`)?.value || 0),
                    qtdProduto: 1,
                    fisicoProduto: fisicoPrduto
                };

                let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || { listaGrid: [] };

                let produtoExistente = listaProdutos.listaGrid.find(item => item.idProduto === produto.idProduto);

                if (!produtoExistente) {
                    listaProdutos.listaGrid.push(produto);
                    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
                }
                dialog.close();
                //redirecionar para o carrinho
                window.location.href = "carrinho";
            });

            dialog.showModal();

            if (!flipCard.dataset.listenersAdded) {
                refresh?.addEventListener("click", () => {
                    flipCard.classList.remove("virado2");
                    flipCard.classList.toggle("virado");
                });

                refresh2?.addEventListener("click", () => {
                    flipCard.classList.remove("virado");
                    flipCard.classList.toggle("virado2");
                    refresh2.click();
                });

                fecharBtns.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        dialog.close();
                        flipCard.classList.remove("virado", "virado2");
                    });
                });

                dialog.addEventListener("click", (event) => {
                    const container = dialog.querySelector(".containerDialog-listaProdutos");
                    if (!container.contains(event.target)) {
                        dialog.close();
                        flipCard.classList.remove("virado", "virado2");
                    }
                });

                flipCard.dataset.listenersAdded = "true";
            }
        });
    }
});

// Busca de produtos
document.getElementById('barraBusca-listaProdutos').addEventListener('keyup', function () {
    const termo = this.value.toLowerCase();
    const produtos = document.querySelectorAll('.imgD-listaProdutos');

    produtos.forEach(function (produto) {
        const nome = produto.getAttribute('data-nome');
        produto.style.display = nome.includes(termo) ? '' : 'none';
    });
});
