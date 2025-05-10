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
    this.botoesOrdenar.forEach((botao) => {
      const coluna = botao.getAttribute('data-valor');
      botao.addEventListener("click", () => {
        this.ordenarItensGrid(botao, coluna);
      });
    });
    this.preencherGrid();
    this.adicionarBusca();
    this.adicionarPaginacao();
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

  adicionarPaginacao() {
    const paginacaoContainer = document.getElementById(this.idPaginacao); // Seleciona o container de paginação
    if (!paginacaoContainer) return; // Se o container de paginação não existir, retorna
    paginacaoContainer.innerHTML = ""; // Limpa a paginação existente
    const totalPaginas = Math.ceil(this.listaGrid.length / this.itemsPerPage); // Calcula o total de paginas
    let qtdBotoes = this.maxPageButtons; // Quantidade de botões de paginação
    if (this.currentPage > 1 && this.currentPage < totalPaginas) {
        qtdBotoes -= 2; // Ajusta qtdBotoes para -2 se for mostrar o (primeira pagina) e (ultima pagina)
    } else if (this.currentPage === totalPaginas || this.currentPage === 1) {
        qtdBotoes -= 1;
    }
    let startPage = Math.max(1, this.currentPage - Math.floor(qtdBotoes / 2)); // Calcula o inicio da páginação
    let endPage = Math.min(totalPaginas, startPage + qtdBotoes - 1); // Calcula o fim da páginação
    if (endPage - startPage + 1 < qtdBotoes) {// Ajusta startPage e endPage para garantir que sempre mostre qtdBotoes
        startPage = Math.max(1, endPage - qtdBotoes + 1); // Se for menor que qtdBotoes, calcula o inicio da páginação
    }
    const criarBotao = (texto, pagina) => {// Função para criar botões de paginação
        const botao = document.createElement("button");
        botao.textContent = texto;
        botao.className = (pagina === this.currentPage) ? "active" : ""; // Se for a pagina atual, adiciona a classe 'active'
        botao.addEventListener("click", () => { // Adiciona evento de clique
            this.currentPage = pagina;
            this.preencherGrid();
            this.adicionarPaginacao();
        });
        paginacaoContainer.appendChild(botao);
    };
    if(startPage != endPage){ // Só exibir se houver mais de uma página
      if (this.currentPage > 1) criarBotao("<<", 1);// Botão Primeira Página
      for (let i = startPage; i <= endPage; i++) {
          criarBotao(i, i); // Cria os botões das outras paginas
      }
      if (this.currentPage < totalPaginas) criarBotao(">>", totalPaginas);// Botão Última Página
    }
  }

  ordenarItensGrid(element, coluna) {
    if (element.className === 'sort-desc') { // Se o botão estiver com a classe 'sort-desc', inverte a ordenação
      element.className = 'sort-asc'; // Torna o botão 'sort-asc' e inverte a ordenação
      this.listaGrid.sort((a, b) => {
        return this.compararValores(a[coluna], b[coluna]);
      });
    } else {
      element.className = 'sort-desc'; // Torna o botão 'sort-desc' e inverte a ordenação
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
      this.adicionarPaginacao();
    }
  }

  atualizarQtdItensGrid(valorId, novaQuantidade) {
    const index = this.listaGrid.findIndex(item => item.id === parseInt(valorId)); // Encontra o index do item
    if (index !== -1) {
      this.listaGrid[index].qtd = novaQuantidade; // Atualiza a quantidade
      const originalIndex = this.listaGridOriginal.findIndex(item => item.id === parseInt(valorId)); // Encontra o index da lista original
      if (originalIndex !== -1) {
        this.listaGridOriginal[originalIndex].qtd = novaQuantidade; // Atualiza a quantidade na lista original
      }
      this.preencherGrid();
    }
  }

  adicionarBusca() {
    const campoBusca = document.querySelector(this.config.idInputBusca); // Seleciona o campo de busca
    if (campoBusca) {
      campoBusca.addEventListener('input', () => { // Adiciona evento de input
        const colunas = campoBusca.getAttribute('data-valor').split(','); // Obtem as colunas de busca
        this.buscarItens(campoBusca.value, colunas); // Chama a função de busca
      });
    }
  }

  buscarItens(valorBusca, colunas) {
    if (valorBusca.trim() === "") {
      this.listaGrid = [...this.listaGridOriginal]; // Se o valor de busca for vazio, retorna a lista original
    } else {
      this.listaGrid = this.listaGridOriginal.filter(item => { // Filtra a lista de acordo com o valor de busca
        return colunas.some(coluna => {
          // Verifica se a coluna existe no item antes de tentar acessar seu valor
          if (item.hasOwnProperty(coluna)) { // Verifica se a coluna existe no item
            return item[coluna].toString().toLowerCase().includes(valorBusca.toLowerCase()); // Verifica se o valor da coluna contém o valor de busca
          }
          return false;
        });
      });
    }
    this.currentPage = 1; // Resetar para a primeira página após a busca
    this.preencherGrid();
    this.adicionarPaginacao();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem('listaProdutos')) || {};
  const grid = storedData.listaGrid || [];

  const config = {
    idGrid: "itensGrid",
    idSortBotao: "#btOrdenar",
    itensPorPagina: 15,
    formatarGrid: (item) => {
      let valor = parseFloat(item.valorProduto);
      let qtd = parseInt(1);
      let totalProduto = qtd * valor;
      let gridRow = `
        <div class="itemGridRow">
          <div class="itemGridCell" data-label="Produto">${item.nomeProduto}</div>
          <div class="itemGridCell" data-label="Valor"><span class="cor-moeda">D$</span> <span class="cor-valor">${totalProduto}</span></div>
          <div class="itemGridCell" data-label="Ações"><button class="botao-remover" data-id="${item.idProduto}"><img src="${imgRemoverSrc}"></button></div>
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
