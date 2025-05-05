document.addEventListener("DOMContentLoaded", function () {
    const produtos = document.getElementsByClassName("imgD");

    for (let i = 0; i < produtos.length; i++) {
        produtos[i].children[0].addEventListener("click", function () {
            const idProduto = produtos[i].children[0].dataset.valor;
            const dialog = document.getElementById(`modal-${idProduto}`);
            const flipCard = document.getElementById(`flip-${idProduto}`);
            const refresh = flipCard.querySelector(".frente .refresh");
            const refresh2 = flipCard.querySelector(".tras .refresh");
            const fecharBtns = dialog.querySelectorAll(".fechar");
            const adiquirirBtn = dialog.querySelector(".Adquirir");

            adiquirirBtn.addEventListener("click", () => {
                const idProduto = adiquirirBtn.dataset.valor;
                const tipo = document.querySelector(`input[name="tipoProduto[${idProduto}]"]`).value;
                console.log(tipo);
                let fisicoPrduto = false
                if (tipo == "Físico") {
                    fisicoPrduto = true
                }
                
                // Adiciona o produto ao localStorage
                const produto = {
                    id: parseInt(idProduto),
                    idProduto: parseInt(idProduto),
                    nomeProduto: document.querySelector(`input[name="nomeProduto[${idProduto}]"]`).value,
                    valorProduto: parseInt(document.querySelector(`input[name="valorProduto[${idProduto}]"]`).value),
                    qtdProduto: 1,
                    fisicoProduto: fisicoPrduto
                };
                
                let listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || { listaGrid: [] };

                // Verifica se o produto já existe na lista
                let produtoExistente = listaProdutos.listaGrid.find(item => item.idProduto === produto.idProduto);

                if (!produtoExistente) {
                    listaProdutos.listaGrid.push(produto);
                    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
                }

                dialog.close();
            });

            dialog.showModal();

            if (!flipCard.dataset.listenersAdded) {
                refresh.addEventListener("click", () => {
                    flipCard.classList.remove("virado2");
                    flipCard.classList.toggle("virado");
                });

                refresh2.addEventListener("click", () => {
                    flipCard.classList.remove("virado");
                    flipCard.classList.toggle("virado2");
                    refresh2.click()
                });

                fecharBtns.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        dialog.close();
                        flipCard.classList.remove("virado", "virado2");
                    });
                });

                dialog.addEventListener("click", (event) => {
                    const container = dialog.querySelector(".container");
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

document.getElementById('barraBusca').addEventListener('keyup', function () {
    const termo = this.value.toLowerCase();
    const produtos = document.querySelectorAll('.imgD');

    produtos.forEach(function (produto) {
        const nome = produto.getAttribute('data-nome');
        if (nome.includes(termo)) {
            produto.style.display = '';
        } else {
            produto.style.display = 'none';
        }
    });
});