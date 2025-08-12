document.addEventListener('DOMContentLoaded', () => {
  // Elementos da UI
  const popUpAdicionarDesafio = document.getElementById('popUpAdicionarDesafio');
  const addDesafio = document.getElementById('addDesafio');
  const iconeX = document.getElementById('iconeX');
  const container = document.getElementById('listaDesafios');
  const inputPesquisa = document.getElementById('pesquisaDesafio');
  const paginacaoContainer = document.querySelector('.pagination');

  // Função para formatar datas no formato aceito pelo <input type="date">
  function formatarDataParaInput(dataISO) {
    if (!dataISO) return '';
    const d = new Date(dataISO);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // Configuração inicial
  if (addDesafio && popUpAdicionarDesafio) {
    addDesafio.addEventListener('click', () => popUpAdicionarDesafio.showModal());
  }

  if (iconeX && popUpAdicionarDesafio) {
    iconeX.addEventListener('click', () => popUpAdicionarDesafio.close());
  }

  // Estado da aplicação
  const estado = {
    paginaAtual: 1,
    totalPaginas: 1,
    termoPesquisa: '',
    carregando: false
  };

  // Função principal para buscar desafios
  async function buscarDesafios(pagina = 1, termo = '') {
    if (estado.carregando) return;
    estado.carregando = true;
    
    try {
      const params = new URLSearchParams();
      if (termo) params.append('nome', termo);
      if (pagina > 1) params.append('desafio_page', pagina);

      const url = `${window.location.pathname}?${params.toString()}`;
      const response = await fetch(url, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      const data = await response.json();
      
      // Atualiza o estado
      estado.paginaAtual = data.paginacao.pagina_atual;
      estado.totalPaginas = data.paginacao.total_paginas;
      estado.termoPesquisa = termo;
      
      // Renderiza os desafios e a paginação
      renderizarDesafios(data.desafios);
      atualizarPaginacao(data.paginacao);
      
    } catch (error) {
      console.error('Erro ao buscar desafios:', error);
      container.innerHTML = '<p>Erro ao carregar desafios. Tente recarregar a página.</p>';
    } finally {
      estado.carregando = false;
    }
  }

  // Renderiza a lista de desafios
  function renderizarDesafios(desafios) {
    if (!container) return;

    container.innerHTML = '';

    if (!desafios || desafios.length === 0) {
      container.innerHTML = '<p>Nenhum desafio encontrado.</p>';
      return;
    }

    desafios.forEach(desafio => {
      const div = document.createElement('div');
      div.className = 'desafio-listaDeDesafios';
      
      // Corrigido para formato yyyy-MM-dd
      const dataInicio = formatarDataParaInput(desafio.dataInicio);
      const dataFim = formatarDataParaInput(desafio.dataFim);

      div.innerHTML = `
        <input type="hidden" name="id" class="idDesafio" value="${desafio.id}">
        <div class="desafioLeft-listaDeDesafios">
          <img src="/static/img/alvoCampanha.png" alt="">
          <p class="nomeDesafio-listaDeDesafios">${desafio.nome}</p>
        </div>
        <div class="desafioRight-listaDeDesafios">
          <p class="dg-listaDeDesafios">DG$ <span class="valor-listaDeDesafios">${desafio.valor}</span></p>
          <div class="botoesEditar-listaDeDesafios">
            <img class="botaoEditar-listaDeDesafios" data-id="${desafio.id}" src="/static/img/edit.png" alt="Editar">
            <img class="btn-desativar-desafio-listaDeDesafios" data-id="${desafio.id}" src="/static/img/lixeira.png" alt="Desativar">
          </div>
        </div>

        <dialog class="popUpEditarDesafio-listaDeDesafios" id="popUpEditarDesafio-${desafio.id}">
          <div class='body-cadastrarDesafio'>
            <div class="header-cadastrarDesafio">
              <img src="/static/img/logoAdmin.png" alt="LogoAdmin">
              <div class="botao-cadastrarDesafio">
                <img class="iconeX-cadastrarDesafio" src="/static/img/iconeX.png" alt="">
              </div>
            </div>

            <form method="POST" class="formDesafio-cadastrarDesafio" id="formCadastrarDesafio-${desafio.id}">
              <input type="hidden" name="csrfmiddlewaretoken" value="${document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''}">
              <input type="hidden" name="id" value="${desafio.id}">

              <div class="form-cadastrarDesafio">
                <div class="cima-cadastrarDesafio">
                  <div class='inputsNome-cadastrarDesafio'>
                    <div class="nomeDesafioDiv-cadastrarDesafio">
                      <label>Nome do desafio</label>
                      <input type="text" name="nome" class="nomeDesafio-cadastrarDesafio" value="${desafio.nome || ''}" required>
                    </div>
                    <div class="nomeDesafioDiv-cadastrarDesafio">
                      <label>Valor do desafio</label>
                      <input type="number" name="valor" class="valorDesafio-cadastrarDesafio" value="${desafio.valor || ''}" required>
                    </div>
                  </div>
                  <div class="descricaoDesafioDiv-cadastrarDesafio">
                    <label>Descrição</label>
                    <textarea name="descricao" class="descricao-cadastrarDesafio">${desafio.descricao || ''}</textarea>
                  </div>
                </div>
                <div class="baixo-cadastrarDesafio">
                  <div class="statusDesafioDiv-cadastrarDesafio">
                    <label>Campanha</label>
                    <select name="campanha" id="campanha-${desafio.id}" class="select-campanha">
                      ${desafio.idCampanha ? 
                        `<option value="${desafio.idCampanha}">${desafio.campanha_nome || 'Campanha'}</option>` : 
                        '<option value="">Sem Campanha</option>'}
                      ${desafio.campanhas?.map(c => 
                        `<option value="${c.id}">${c.nome}</option>`
                      ).join('') || ''}
                    </select>
                  </div>
                  <div class="dataDesafioDiv-cadastrarDesafio">
                    <div class="dataDesafioInterno-cadastrarDesafio">
                      <label>Início</label>
                      <input type="date" name="dataInicio" value="${dataInicio}">
                    </div>
                    <div class="dataDesafioInterno-cadastrarDesafio">
                      <label>Fim</label>
                      <input type="date" name="dataFim" value="${dataFim}">
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" class="button-cadastrarDesafio">Concluído</button>
            </form>
          </div>
        </dialog>
      `;

      // Adiciona eventos aos elementos criados
      const btnEditar = div.querySelector('.botaoEditar-listaDeDesafios');
      const btnDesativar = div.querySelector('.btn-desativar-desafio-listaDeDesafios');
      const modal = div.querySelector('dialog');
      const iconeXModal = div.querySelector('.iconeX-cadastrarDesafio');
      const form = div.querySelector('.formDesafio-cadastrarDesafio');

      if (btnEditar) btnEditar.addEventListener('click', () => modal.showModal());
      if (iconeXModal) iconeXModal.addEventListener('click', () => modal.close());

      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await enviarFormularioEdicao(form, div, modal);
        });
      }

      if (btnDesativar) {
        btnDesativar.addEventListener('click', () => confirmarDesativacao(desafio.id));
      }

      container.appendChild(div);
    });
  }

  function atualizarPaginacao(paginacao) {
    if (!paginacaoContainer) return;

    let linkAnterior = paginacaoContainer.querySelector('#linkAnterior');
    let linkProximo = paginacaoContainer.querySelector('#linkProximo');
    let spanPagina = paginacaoContainer.querySelector('#spanPagina');

    if (!linkAnterior) {
      paginacaoContainer.insertAdjacentHTML('afterbegin', `<a id="linkAnterior" href="#">Anterior</a>`);
      linkAnterior = paginacaoContainer.querySelector('#linkAnterior');
    }
    if (!spanPagina) {
      paginacaoContainer.insertAdjacentHTML('beforeend', `<span id="spanPagina"></span>`);
      spanPagina = paginacaoContainer.querySelector('#spanPagina');
    }
    if (!linkProximo) {
      paginacaoContainer.insertAdjacentHTML('beforeend', `<a id="linkProximo" href="#">Próxima</a>`);
      linkProximo = paginacaoContainer.querySelector('#linkProximo');
    }

    spanPagina.textContent = `Página ${paginacao.pagina_atual} de ${paginacao.total_paginas}`;
    linkAnterior.href = paginacao.tem_anterior ? `?desafio_page=${paginacao.pagina_anterior}` : '#';
    linkProximo.href = paginacao.tem_proximo ? `?desafio_page=${paginacao.proxima_pagina}` : '#';
    linkAnterior.style.visibility = paginacao.tem_anterior ? 'visible' : 'hidden';
    linkProximo.style.visibility = paginacao.tem_proximo ? 'visible' : 'hidden';
  }

  // Função para enviar o formulário de edição via AJAX
  async function enviarFormularioEdicao(form, divDesafio, modal) {
  const formData = new FormData(form);
  const id = formData.get('id');

  const payload = {
    nome: formData.get('nome'),
    valor: formData.get('valor'),
    descricao: formData.get('descricao'),
    campanha: formData.get('campanha'),
    dataInicio: formData.get('dataInicio'),
    dataFim: formData.get('dataFim'),
  };

  console.log(payload)

  const csrfToken = formData.get('csrfmiddlewaretoken');

  const data = await apiRequest(`/api/desafio/${id}/`, 'PUT', payload, {
    'X-CSRFToken': csrfToken,
    'X-Requested-With': 'XMLHttpRequest'
  });

  if (data) {
    if (data.success) {
      divDesafio.querySelector('.nomeDesafio-listaDeDesafios').textContent = payload.nome;
      divDesafio.querySelector('.valor-listaDeDesafios').textContent = payload.valor;
      modal.close();
      buscarDesafios();
    } else {
      alert(data.error || 'Erro ao atualizar desafio');
    }
  } else {
    alert('Erro na requisição de edição');
  }
}

async function confirmarDesativacao(id) {
  if (!confirm('Tem certeza que deseja desativar este desafio?')) return;

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
  if (!csrfToken) {
    alert('Token de segurança não encontrado!');
    return;
  }

  const data = await apiRequest(`/api/desafio/${id}/`, 'PUT', { is_active: false }, {
    'X-CSRFToken': csrfToken,
    'X-Requested-With': 'XMLHttpRequest'
  });

  if (data) {
    if (data.success) {
      alert('Desafio desativado com sucesso!');
      buscarDesafios();
    } else {
      alert(data.error || 'Erro ao desativar desafio');
    }
  } else {
    alert('Erro na requisição de desativação');
  }
}


  // Função para confirmar e processar desativação
  async function confirmarDesativacao(id) {
    if (!confirm('Tem certeza que deseja desativar este desafio?')) return;
    
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
    if (!csrfToken) {
      alert('Token de segurança não encontrado!');
      return;
    }
    
    try {
      const response = await fetch(`/api/desafio/${id}/`, {
        method: 'PUT',
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: false })
      });
      
      if (response.ok) {
        alert('Desafio desativado com sucesso!');
        buscarDesafios(estado.paginaAtual, estado.termoPesquisa);
      } else {
        throw new Error('Erro na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro ao desativar desafio:', error);
      alert('Erro ao desativar desafio');
    }
  }

  // Evento de pesquisa
  if (inputPesquisa) {
    let timeoutPesquisa;
    inputPesquisa.addEventListener('input', () => {
      clearTimeout(timeoutPesquisa);
      timeoutPesquisa = setTimeout(() => {
        buscarDesafios(1, inputPesquisa.value.trim());
      }, 500);
    });
  }

  // Evento de clique na paginação
  document.addEventListener('click', (e) => {
    if (e.target.closest('.pagination a')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      if (href && href !== '#') {
        const pagina = new URLSearchParams(href.split('?')[1]).get('desafio_page');
        buscarDesafios(pagina, estado.termoPesquisa);
      }
    }
  });

  // Carrega os dados iniciais
  buscarDesafios();
});
