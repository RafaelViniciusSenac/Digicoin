document.addEventListener('DOMContentLoaded', () => {
  const popUpAdicionarDesafio = document.getElementById('popUpAdicionarDesafio');
  const addDesafio = document.getElementById('addDesafio');
  const iconeX = document.getElementById('iconeX');

  if (addDesafio && popUpAdicionarDesafio) {
    addDesafio.addEventListener('click', () => {
      popUpAdicionarDesafio.showModal();
    });
  }

  if (iconeX && popUpAdicionarDesafio) {
    iconeX.addEventListener('click', () => {
      popUpAdicionarDesafio.close();
    });
  }

  // Container onde os desafios serão renderizados
  const container = document.getElementById('listaDesafios');
  const inputPesquisa = document.getElementById('pesquisaDesafio');

  if (!container) {
    console.error('Container #desafios-container não encontrado!');
    return;
  }
  if (!inputPesquisa) {
    console.warn('Campo de pesquisa #pesquisaDesafio não encontrado!');
  }

  async function buscarDesafios(nome = '', pagina = 1) {
    const params = new URLSearchParams();
    if (nome) params.append('nome', nome);
    if (pagina) params.append('desafio_page', pagina);

    const url = `${window.location.pathname}?${params.toString()}`;

    const response = await fetch(url, {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    });

    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    renderizarDesafios(data.desafios);
  }

  if (inputPesquisa) {
    inputPesquisa.addEventListener('input', function () {
      const nome = this.value.trim();
      buscarDesafios(nome).catch((err) =>
        console.error('Erro ao buscar desafios:', err),
      );
    });
  }

  function renderizarDesafios(desafios) {
    container.innerHTML = '';

    if (!desafios || desafios.length === 0) {
      container.innerHTML = '<p>Nenhum desafio encontrado.</p>';
      return;
    }

    desafios.forEach((desafio) => {
      const div = document.createElement('div');
      div.className = 'desafio-listaDeDesafios';

      div.innerHTML = `
        <input type="hidden" name="id" class="idDesafio" value="${desafio.id}">
        <div class="desafioLeft-listaDeDesafios">
          <img src="/static/img/alvoCampanha.png" alt="">
          <p class="nomeDesafio-listaDeDesafios">${desafio.nome}</p>
        </div>
        <div class="desafioRight-listaDeDesafios">
          <p class="dg-listaDeDesafios">DG$ <span class="valor-listaDeDesafios">${
            desafio.valor
          }</span></p>
          <div class="botoesEditar-listaDeDesafios">
            <img class="botaoEditar-listaDeDesafios" data-id="${
              desafio.id
            }" src="/static/img/edit.png" alt="Editar">
            <img class="btn-desativar-desafio-listaDeDesafios" data-id="${
              desafio.id
            }" src="/static/img/lixeira.png" alt="Desativar">
          </div>
        </div>

        <dialog class="popUpEditarDesafio-listaDeDesafios" id="popUpEditarDesafio-${
          desafio.id
        }">
          <div class='body-cadastrarDesafio'>
            <div class="header-cadastrarDesafio">
              <img src="/static/img/logoAdmin.png" alt="LogoAdmin">
              <div class="botao-cadastrarDesafio">
                <img class="iconeX-cadastrarDesafio" src="/static/img/iconeX.png" alt="">
              </div>
            </div>

            <form method="POST" class="formDesafio-cadastrarDesafio" id="formCadastrarDesafio-${
              desafio.id
            }">
              <input type="hidden" name="csrfmiddlewaretoken" value="${
                document.querySelector('[name=csrfmiddlewaretoken]')
                  ? document.querySelector('[name=csrfmiddlewaretoken]').value
                  : ''
              }">
              <input type="hidden" name="id" value="${desafio.id}">

              <div class="form-cadastrarDesafio">
                <div class="cima-cadastrarDesafio">
                  <div class='inputsNome-cadastrarDesafio'>
                    <div class="nomeDesafioDiv-cadastrarDesafio">
                      <label>Nome do desafio</label>
                      <input type="text" name="nome" class="nomeDesafio-cadastrarDesafio" value="${
                        desafio.nome || ''
                      }">
                    </div>
                    <div class="nomeDesafioDiv-cadastrarDesafio">
                      <label>Valor do desafio</label>
                      <input type="number" name="valor" class="valorDesafio-cadastrarDesafio" value="${
                        desafio.valor || ''
                      }">
                    </div>
                  </div>
                  <div class="descricaoDesafioDiv-cadastrarDesafio">
                    <label>Descrição</label>
                    <textarea name="descricao" class="descricao-cadastrarDesafio">${
                      desafio.descricao || ''
                    }</textarea>
                  </div>
                </div>
                <div class="baixo-cadastrarDesafio">
                  <div class="statusDesafioDiv-cadastrarDesafio">
                    <label>Campanha</label>
                    <select name="campanha" id="campanha-${desafio.id}">
                      ${
                        desafio.idCampanha
                          ? `<option value="${desafio.idCampanha}">${desafio.idCampanha}</option>`
                          : `<option value="">Sem Campanha</option>`
                      }
                      ${
                        desafio.campanhas
                          ? desafio.campanhas
                              .map(
                                (c) =>
                                  `<option value="${c.id}">${c.nome}</option>`,
                              )
                              .join('')
                          : ''
                      }
                    </select>
                  </div>
                  <div class="dataDesafioDiv-cadastrarDesafio">
                    <div class="dataDesafioInterno-cadastrarDesafio">
                      <label>Início</label>
                      <input type="date" name="dataInicio" value="${
                        desafio.dataInicio || ''
                      }">
                    </div>
                    <div class="dataDesafioInterno-cadastrarDesafio">
                      <label>Fim</label>
                      <input type="date" name="dataFim" value="${
                        desafio.dataFim || ''
                      }">
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" class="button-cadastrarDesafio">Concluído</button>
            </form>
          </div>
        </dialog>
      `;

      // Abrir popup editar
      const btnEditar = div.querySelector('.botaoEditar-listaDeDesafios');
      const modal = div.querySelector('dialog');
      const iconeX = div.querySelector('.iconeX-cadastrarDesafio');

      if (btnEditar)
        btnEditar.addEventListener('click', () => modal.showModal());
      if (iconeX) iconeX.addEventListener('click', () => modal.close());

      // Submissão do formulário editar via AJAX
      const form = div.querySelector('.formDesafio-cadastrarDesafio');
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const id = fd.get('id');
        const csrf = fd.get('csrfmiddlewaretoken');

        try {
          const res = await fetch(`/desafios/${id}/editar/`, {
            method: 'POST',
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRFToken': csrf,
            },
            body: fd,
          });

          const json = await res.json();

          if (res.ok && json.success) {
            // Atualiza UI com novos dados
            div.querySelector('.nomeDesafio-listaDeDesafios').textContent =
              fd.get('nome');
            div.querySelector('.valor-listaDeDesafios').textContent =
              fd.get('valor');
            modal.close();
          } else {
            alert(json.error || 'Erro ao editar desafio.');
          }
        } catch (err) {
          console.error(err);
          alert('Erro ao editar (veja o console).');
        }
      });

      // Botão desativar desafio dentro do item
      const btnDesativar = div.querySelector(
        '.btn-desativar-desafio-listaDeDesafios',
      );
      if (btnDesativar) {
        btnDesativar.addEventListener('click', async () => {
          const id = btnDesativar.getAttribute('data-id');
          const confirmacao = confirm(
            'Tem certeza que deseja desativar este desafio?',
          );
          if (!confirmacao) return;

          const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')
            ? document.querySelector('[name=csrfmiddlewaretoken]').value
            : '';

          try {
            const res = await fetch(`/api/desafio/${id}/`, {
              method: 'PUT',
              headers: {
                'X-CSRFToken': csrfToken,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ is_active: false }),
            });

            if (res.ok) {
              alert('Desafio desativado com sucesso!');
              window.location.reload();
            } else {
              alert('Erro ao desativar desafio.');
            }
          } catch (err) {
            console.error('Erro ao desativar desafio:', err);
            alert('Erro na requisição.');
          }
        });
      }

      container.appendChild(div);
    });
  }
  
  buscarDesafios(nomeAtual, paginaDesejada);

});
