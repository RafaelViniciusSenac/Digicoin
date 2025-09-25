document.addEventListener("DOMContentLoaded", function () {
    // ==========================
    // Barra de pesquisa
    // ==========================
    const searchInput = document.getElementById('barraBusca-listaProdutos');
    if (searchInput) {
        const form = searchInput.closest('form');
        let timeout = null;

        // Quando o usuário muda (ex: pressiona Enter, sai do input)
        searchInput.addEventListener('change', function () {
            clearTimeout(timeout);
            form.submit();
        });

        // Quando o usuário digita
        searchInput.addEventListener('input', function () {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                form.submit();
            }, 400); // tempo de espera
        });
    }

    // ==========================
    // Sistema de produtos/carrinho
    // ==========================
    const container = document.querySelector(".imagensDigix-listaProdutos");

    if (container) {
        container.addEventListener("click", function (e) {
            const botao = e.target.closest("button[data-valor]"); // botão da imagem do produto
            if (!botao) return;

            const idProduto = botao.dataset.valor;
            const dialog = document.getElementById(`modal-${idProduto}`);
            const flipCard = document.getElementById(`flip-${idProduto}`);
            const refresh = flipCard?.querySelector(".frente-listaProdutos .refresh-listaProdutos");
            const refresh2 = flipCard?.querySelector(".tras-listaProdutos .refresh-listaProdutos");
            const fecharBtns = dialog.querySelectorAll(".fechar-listaProdutos");
            const adiquirirBtn = dialog.querySelector(".Adquirir-listaProdutos");
            const msgErrorAddProduto = dialog.querySelector(".msgErrorAddProduto-listaProdutos");
            const valorProduto = parseInt(document.querySelector(`input[name="valorProduto[${idProduto}]"]`)?.value || 0);

            const listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || { listaGrid: [] };
            let quantidadeMoedasCarrinho = 0;
            listaProdutos.listaGrid.forEach(item => {
                quantidadeMoedasCarrinho += item.valorProduto;
            });

            const quantidadeMoedas = document.getElementById("quantidadeMoedas").value - quantidadeMoedasCarrinho;

            let produtoExistente = listaProdutos.listaGrid.find(item => item.idProduto === parseInt(idProduto));
            let msgError = "Saldo insuficiente.";
            if (produtoExistente) msgError = "Produto já existente no carrinho.";

            if (quantidadeMoedas < valorProduto || produtoExistente) {
                adiquirirBtn.disabled = true;
                adiquirirBtn.style.opacity = 0.5;
                msgErrorAddProduto.style.display = "block";
                msgErrorAddProduto.innerHTML = msgError;
            } else {
                adiquirirBtn.disabled = false;
                adiquirirBtn.style.opacity = 1;
                msgErrorAddProduto.style.display = "none";
            }

            adiquirirBtn.onclick = function () {
                if (quantidadeMoedas < valorProduto) return;

                const tipoQuantidade = document.querySelector(`input[name="quantidadeProduto[${idProduto}]"]`)?.value || "";
                if (tipoQuantidade <= 0) return;

                const tipo = document.querySelector(`input[name="tipoProduto[${idProduto}]"]`)?.value || "";
                let fisicoPrduto = (tipo == "Físico");

                const produto = {
                    id: parseInt(idProduto),
                    idProduto: parseInt(idProduto),
                    nomeProduto: document.querySelector(`input[name="nomeProduto[${idProduto}]"]`)?.value || "",
                    valorProduto: valorProduto,
                    qtdProduto: 1,
                    fisicoProduto: fisicoPrduto
                };

                if (!produtoExistente) {
                    listaProdutos.listaGrid.push(produto);
                    localStorage.setItem('listaProdutos', JSON.stringify(listaProdutos));
                }

                dialog.close();
                window.location.href = "carrinho";
            };

            dialog.showModal();

                if (!flipCard.dataset.listenersAdded) {
                    refresh?.addEventListener("click", () => {
                        flipCard.classList.remove("virado2");
                        flipCard.classList.toggle("virado");
                    });

                    refresh2?.addEventListener("click", () => {
                        flipCard.classList.remove("virado");
                        flipCard.classList.toggle("virado2");
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
