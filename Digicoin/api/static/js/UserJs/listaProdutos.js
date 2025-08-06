
document.addEventListener("DOMContentLoaded", function () {
    const produtos = document.getElementsByClassName("imgD-listaProdutos");
    const listaProdutos = JSON.parse(localStorage.getItem('listaProdutos')) || { listaGrid: [] };
    let quantidadeMoedasCarrinho = 0;
    listaProdutos.listaGrid.forEach(item => {
        quantidadeMoedasCarrinho += item.valorProduto;
    })
    const quantidadeMoedas = document.getElementById("quantidadeMoedas").value - quantidadeMoedasCarrinho;

    for (let i = 0; i < produtos.length; i++) {
        produtos[i].children[0].addEventListener("click", function () {
            const idProduto = produtos[i].children[0].dataset.valor;
            const dialog = document.getElementById(`modal-${idProduto}`);
            const flipCard = document.getElementById(`flip-${idProduto}`);
            const refresh = flipCard.querySelector(".frente-listaProdutos .refresh-listaProdutos");
            const refresh2 = flipCard.querySelector(".tras-listaProdutos .refresh-listaProdutos");
            const fecharBtns = dialog.querySelectorAll(".fechar-listaProdutos");
            const adiquirirBtn = dialog.querySelector(".Adquirir-listaProdutos");
            const msgErrorAddProduto = dialog.querySelector(".msgErrorAddProduto-listaProdutos");
            const valorProduto = parseInt(document.querySelector(`input[name="valorProduto[${idProduto}]"]`)?.value || 0)
            let produtoExistente = listaProdutos.listaGrid.find(item => item.idProduto === parseInt(idProduto));
            let msgError = "Saldo insuficiente.";
            if(produtoExistente) {
                msgError = "Produto já existente no carrinho.";
            }

            if (quantidadeMoedas < valorProduto || produtoExistente) {
                adiquirirBtn.disabled = true;
                adiquirirBtn.style.opacity = 0.5;
                msgErrorAddProduto.style.display = "block";
                msgErrorAddProduto.innerHTML = msgError;
            }else {
                adiquirirBtn.disabled = false;
                adiquirirBtn.style.opacity = 1;
                msgErrorAddProduto.style.display = "none";
            }
            adiquirirBtn.addEventListener("click", () => {
                if (quantidadeMoedas < valorProduto) {
                    return;
                }
                const idProdutoAdd = adiquirirBtn.dataset.valor;
                const tipoQuantidade = document.querySelector(`input[name="quantidadeProduto[${idProdutoAdd}]"]`)?.value || "";
                
                if (tipoQuantidade <= 0) {
                    return;
                }
                
                const tipo = document.querySelector(`input[name="tipoProduto[${idProdutoAdd}]"]`)?.value || "";
                let fisicoPrduto = (tipo == "Físico");

                const produto = {
                    id: parseInt(idProdutoAdd),
                    idProduto: parseInt(idProdutoAdd),
                    nomeProduto: document.querySelector(`input[name="nomeProduto[${idProdutoAdd}]"]`)?.value || "",
                    valorProduto: valorProduto,
                    qtdProduto: 1,
                    fisicoProduto: fisicoPrduto
                };

                if (!produtoExistente) {
                    //soma a quantidade de moedas de toda a listaProdutos do localstorage
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

function onClickAdicionarProduto(event) {
    const button = event.currentTarget;
    const produtoId = button.getAttribute("data-valor");

    const quantidadeSpan = document.querySelector(`#flip-${produtoId} .quantidade-listaProdutos span`);
    const quantidade = parseInt(quantidadeSpan.textContent);

    if (quantidade <= 0) {
        alert("Produto indisponível!");
    } else {
        adicionarAoCarrinho(produtoId);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".Adquirir-listaProdutos").forEach(button => {
        const produtoId = button.getAttribute("data-valor");
        const quantidadeSpan = document.querySelector(`#flip-${produtoId} .quantidade-listaProdutos span`);
        const quantidade = parseInt(quantidadeSpan.textContent);

        if (quantidade <= 0) {
            button.disabled = true;
            button.classList.add("botao-desativado-produtos");
        }

        button.addEventListener("click", onClickAdicionarProduto);
    });
});



