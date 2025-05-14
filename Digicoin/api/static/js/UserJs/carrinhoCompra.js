class Grid {
  constructor(itens = [], config = {}) { // Recebe o array de itens e o config do grid
    this.listaGridOriginal = [...itens]; 
    this.listaGrid = itens;
    this.config = config;
    this.ascending = true;
    this.currentPage = 1;
    this.itemsPerPage = config.itensPorPagina; // Número de itens por página
    this.maxPageButtons = 8; // Número máximo de botões de página visíveis
    this.idLocalGrid = document.getElementById(config.idGrid);
    this.botoesOrdenar = document.querySelectorAll(config.idSortBotao);
    this.idPaginacao = config.idPaginacao;
    this.idInputBusca = config.idInputBusca;
    console.log(this.botoesOrdenar);
    this.botoesOrdenar.forEach((botao) => {
      const coluna = botao.getAttribute('data-valor');
      botao.addEventListener("click", () => {
        this.ordenarItensGrid(botao, coluna);
      });
    });
    this.preencherGrid();
  }

  preencherGrid() {
    this.idLocalGrid.innerHTML = ""; // Limpa os itens existentes
    const start = (this.currentPage - 1) * this.itemsPerPage; // Calcula o inicio da página
    const end = start + this.itemsPerPage; // Calcula o fim da página
    const paginatedItems = this.listaGrid.slice(start, end); // Pega os itens da página
    paginatedItems.forEach((item) => { // Para cada item na página atual
      const itemRow = document.createElement("tr"); // Cria uma linha
      itemRow.innerHTML = this.config.formatarGrid(item); // Formata o item
      this.idLocalGrid.appendChild(itemRow); // Adiciona a linha ao grid
    });
    if (this.config.addEventosGrid) { // Se existir a função de adicionar eventos
      this.config.addEventosGrid(this.listaGrid, this); // Chama a função
    }     
    if (this.config.atualizarTotal) { // Se existir a função de atualizar total
      this.config.atualizarTotal(this.listaGrid, this); // Chama a função
    }
  }

  ordenarItensGrid(element, coluna) {
    if (element.className === 'sort-desc-carrinhoCompras') { // Se o botão estiver com a classe 'sort-desc', inverte a ordenação
      element.className = 'sort-asc-carrinhoCompras'; // Torna o botão 'sort-asc' e inverte a ordenação
      this.listaGrid.sort((a, b) => {
        return this.compararValores(a[coluna], b[coluna]);
      });
    } else {
      element.className = 'sort-desc-carrinhoCompras'; // Torna o botão 'sort-desc' e inverte a ordenação
      this.listaGrid.sort((a, b) => {
        return this.compararValores(b[coluna], a[coluna]);
      });
    }
    this.preencherGrid();
  }

  compararValores(a, b) { // Função para comparar valores
    if (typeof a === 'number' && typeof b === 'number') { // Se os valores forem numéricos
      return a - b; 
    } else if (typeof a === 'string' && typeof b === 'string') { // Se os valores forem strings
      return a.localeCompare(b); 
    } else if (a instanceof Date && b instanceof Date) { // Se os valores forem datas
      return a - b;
    } else if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b ? 0 : a ? -1 : 1;
    } else {
      return 0;
    }
  }

  removerItensGrid(valorId) {
    const index = this.listaGrid.findIndex(item => item.id === parseInt(valorId)); // Encontra o index do item a ser removido
    if (index !== -1) { // Se o item foi encontrado
      this.listaGrid.splice(index, 1); // Remove o item
      this.listaGridOriginal = this.listaGridOriginal.filter(item => item.id !== parseInt(valorId)); // Remove o item da lista original
      this.preencherGrid();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // limpa a lista de produtos
  // localStorage.removeItem('listaProdutos');
  const storedData = JSON.parse(localStorage.getItem('listaProdutos')) || {};
  const grid = storedData.listaGrid || [];
  //adiciona um produto exemplo a lista de produtos
  // grid.push({
  //   id: 1 + grid.length,
  //   idProduto: 1 + grid.length,
  //   nomeProduto: "Produto 1",
  //   valorProduto: 10,
  //   qtd: 1,
  //   fisicoProduto: true
  // });
  //   grid.push({
  //   id: 1 + grid.length,
  //   idProduto: 1 + grid.length,
  //   nomeProduto: "Esse é mue primeiro Produto 2",
  //   valorProduto: 20,
  //   qtd: 1,
  //   fisicoProduto: true
  // });
  localStorage.setItem('listaProdutos', JSON.stringify({ listaGrid: grid }));

  const config = {
    idGrid: "itensGrid",
    idSortBotao: "btOrdenar",
    itensPorPagina: 15,
    formatarGrid: (item) => {
      let valor = parseFloat(item.valorProduto);
      let qtd = parseInt(1);
      let totalProduto = qtd * valor;
      let gridRow = `
        <div class="itemGridRow-carrinhoCompras">
          <div class="itemGridCell-carrinhoCompras col-produto" data-label="Produto">${item.nomeProduto}</div>
          <div class="itemGridCell-carrinhoCompras col-valor" data-label="Valor"><span class="cor-moeda-carrinhoCompras">D$</span> <span class="cor-valor-carrinhoCompras">${totalProduto}</span></div>
          <div class="itemGridCell-carrinhoCompras col-acoes" data-label="Ações"><button class="botao-remover-carrinhoCompras" data-id="${item.idProduto}"><img src="${imgRemoverSrc}"></button></div>
        </div>
      `;
      return gridRow;
    },
    addEventosGrid: (listaGrid, grid) => {
      listaGrid.forEach((item) => {
        const botaoRemover = document.querySelector(`button[data-id="${item.idProduto}"]`);
        if (botaoRemover) {
          botaoRemover.addEventListener('click', () => {
            grid.removerItensGrid(item.idProduto);
            localStorage.setItem('listaProdutos', JSON.stringify({ listaGrid: grid.listaGrid }));
          });
        }
      });
    },
    atualizarTotal: () => {
      let valorTotalCarrinho = 0;
      grid.forEach((item) => {
        let valor = parseFloat(item.valorProduto);
        let qtd = parseInt(1);
        let totalProduto = qtd * valor;
        valorTotalCarrinho += totalProduto;
      });
      const botaoFinalizar = document.getElementById("botaoFinalizarPedido");
      const valorTotal = document.getElementById("valorTotal");
      if (valorTotalCarrinho > 0) {
        botaoFinalizar.disabled = false;
      } else {
        botaoFinalizar.disabled = true;
      }
      valorTotal.textContent = valorTotalCarrinho;
    }
  };
  const carrinho = new Grid(grid, config);
});
