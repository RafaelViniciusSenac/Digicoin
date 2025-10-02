document.addEventListener('DOMContentLoaded', () => {
  // Elementos do popup de cadastro
  const popupCadastrarUsuario = document.getElementById(
    'popupCadastrarUsuario',
  );
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');

  addUsuarios.addEventListener('click', () => {
    popupCadastrarUsuario.showModal();
  });

  fecharCadastrar.addEventListener('click', () => {
    popupCadastrarUsuario.close();
  });

  // Elementos do popup de adicionar moedas
  const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
  const addMoedas = document.getElementById('addMoedas');
  const fecharAdicionarMoedas = document.getElementById(
    'fecharAdicionarMoedas',
  );

  fecharAdicionarMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.close();
  });

  // Elementos de seleção de usuários
  const selecionarTodos = document.getElementById('selecionarTodos');
  const listaUsuarios = document.getElementById('listaUsuarios');
  let todosSelecionadosGlobalmente = false;
  let cacheSelecaoManual = new Set();
  let cacheTodosUsuarios = [];

  // Sincroniza visualmente os checkboxes da página atual com o estado do cache
  function sincronizarCheckboxesComCache() {
    if (!listaUsuarios) return;

    listaUsuarios
      .querySelectorAll(
        '.linhaUsuario-listaDeUsuarios:not(.desativado-listaDeUsuarios) .checkbox',
      )
      .forEach((cb) => {
        const linha = cb.closest('.linhaUsuario-listaDeUsuarios');
        const inputId = linha.querySelector('.idUser-listaDeUsuarios');
        const userId = inputId ? parseInt(inputId.value, 10) : null;

        if (!userId) return;

        if (todosSelecionadosGlobalmente) {
          cb.checked = true;
        } else {
          cb.checked = cacheSelecaoManual.has(userId);
        }
      });

    console.log('🔁 Checkboxes da página atual sincronizados com o cache.');
  }

  // Evento: Selecionar todos os usuários
  selecionarTodos?.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    console.log('✅ Checkbox "Selecionar Todos" alterado:', checked);

    if (checked) {
      try {
        console.log('🔄 Buscando todos os usuários ativos via API...');
        const popupLoading = new Popup();
        popupLoading.showLoadingPopup('Buscando usuários ativos...');
        const res = await fetch('/api/usuarios/ativos-nao-admin/');
        if (!res.ok) throw new Error('Erro ao buscar usuários ativos');

        const data = await res.json();
        popupLoading.hidePopup();
        console.log('📥 Dados recebidos da API:', data);

        cacheTodosUsuarios = data
          .map((usuario) => ({
            id: parseInt(
              usuario.id || usuario.user_id || usuario.id_usuario,
              10,
            ),
          }))
          .filter((u) => !isNaN(u.id));

        if (cacheTodosUsuarios.length === 0) {
          throw new Error('Nenhum ID válido encontrado nos dados da API');
        }

        todosSelecionadosGlobalmente = true;
        cacheSelecaoManual = new Set();

        console.log(
          `✅ ${cacheTodosUsuarios.length} usuários carregados no modo "Selecionar Todos".`,
        );
        sincronizarCheckboxesComCache();
      } catch (err) {
        console.error('❌ Erro ao carregar usuários:', err.message);
        showPopup('Erro ao carregar usuários: ' + err.message, 'Erro', 'erro');
        selecionarTodos.checked = false;
        todosSelecionadosGlobalmente = false;
      }
    } else {
      todosSelecionadosGlobalmente = false;
      console.log(
        '✅ Modo "Selecionar Todos" desativado. Mantendo seleção manual.',
      );
      sincronizarCheckboxesComCache();
    }
  });

  // Evento: Marcar/desmarcar manualmente
  listaUsuarios?.addEventListener('change', (e) => {
    if (!e.target.classList.contains('checkbox')) return;

    const cb = e.target;
    const linha = cb.closest('.linhaUsuario-listaDeUsuarios');
    const inputId = linha.querySelector('.idUser-listaDeUsuarios');
    const userId = inputId ? parseInt(inputId.value, 10) : null;

    if (!userId) {
      console.warn(
        '⚠️ Checkbox alterado, mas ID do usuário não encontrado na linha.',
      );
      return;
    }

    if (cb.checked) {
      cacheSelecaoManual.add(userId);
      console.log(
        `➕ Usuário ID ${userId} adicionado à seleção manual.`,
        Array.from(cacheSelecaoManual),
      );
    } else {
      cacheSelecaoManual.delete(userId);
      console.log(
        `➖ Usuário ID ${userId} removido da seleção manual.`,
        Array.from(cacheSelecaoManual),
      );
    }

    const checkboxesAtivos = Array.from(
      listaUsuarios.querySelectorAll(
        '.linhaUsuario-listaDeUsuarios:not(.desativado-listaDeUsuarios) .checkbox',
      ),
    );
    const todosMarcados =
      checkboxesAtivos.length > 0 && checkboxesAtivos.every((c) => c.checked);

    if (selecionarTodos) {
      selecionarTodos.indeterminate =
        !todosMarcados && checkboxesAtivos.some((c) => c.checked);
      if (!todosSelecionadosGlobalmente) {
        selecionarTodos.checked = todosMarcados;
      }
    }

    console.log(
      `🔁 Estado atual da seleção manual: ${cacheSelecaoManual.size} usuários selecionados.`,
    );
  });

  function getUsuariosSelecionados() {
   
    if (todosSelecionadosGlobalmente && cacheTodosUsuarios.length > 0) {
      console.log(
        `✅ Modo "Selecionar Todos" ativo. Retornando ${cacheTodosUsuarios.length} usuários do cache global.`,
      );
      return cacheTodosUsuarios;
    }

    const selecionados = Array.from(cacheSelecaoManual).map((id) => ({ id }));
    console.log(
      `✅ Modo manual ativo. Retornando ${selecionados.length} usuários do cache manual.`,
    );
    return selecionados;
  }

  // Evento: Abrir popup e enviar moedas
  addMoedas?.addEventListener('click', () => {
    popupAdicionarMoedas.showModal();
    console.log('✅ Popup de adicionar moedas aberto.');

    const usuariosSelecionadosRaw = getUsuariosSelecionados();
    const usuariosSelecionados = JSON.parse(
      JSON.stringify(usuariosSelecionadosRaw),
    ); // Clone profundo
    console.log('📊 Usuários prontos para operação:', usuariosSelecionados);
    console.log('📊 Quantidade:', usuariosSelecionados.length);

    const inputQuantidade = document.getElementById('saldo');
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

    if (!csrf) {
      console.error('❌ Token CSRF não encontrado!');
      return;
    }

    if (usuariosSelecionados.length === 0) {
      console.warn('⚠️ Nenhum usuário selecionado.');
      showPopup('Nenhum usuário selecionado!', 'Erro', 'erro');
      popupAdicionarMoedas.close();
      return;
    }

    const enviarMoedas = async (operacao) => {
      const valor = parseInt(inputQuantidade.value);
      if (isNaN(valor) || valor <= 0) {
        console.warn('⚠️ Valor inválido inserido:', inputQuantidade.value);
        showPopup('Digite um valor válido e positivo!', 'Erro', 'erro');
        return;
      }

      console.log(
        `🚀 Iniciando operação "${operacao}" com valor ${valor} para ${usuariosSelecionados.length} usuário(s).`,
      );

      try {
        const promessas = usuariosSelecionados.map(async (usuario) => {
          console.log(
            `📤 Enviando requisição para usuário ID: ${usuario.id}...`,
          );

          const response = await apiRequest(
            `/api/user/${usuario.id}`,
            'PUT',
            { operacao, saldo: valor },
            { 'X-CSRFToken': csrf },
          );

          if (response.status !== 200) {
            throw new Error(
              `Falha ao atualizar usuário ${usuario.id}: ${response.status} ${response.statusText}`,
            );
          }

          console.log(`✅ Usuário ${usuario.id} atualizado com sucesso.`);
          return response;
        });

        const resultados = await Promise.all(promessas);
        console.log(
          `🎉 Operação concluída com sucesso para ${resultados.length} usuário(s).`,
        );
        const popupAlert = new Popup();
        popupAlert.showPopup(
          `Operação realizada com sucesso para ${resultados.length} usuários!`,
          'Sucesso',
          'sucesso',
        );
        popupAdicionarMoedas.close();
        popupAlert.imgClosed.addEventListener("click", () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('❌ Erro durante a operação:', error);
        showPopup('Erro na operação: ' + error.message, 'Erro', 'erro');
      }
    };

    // Botão "Adicionar"
    document.getElementById('adicionar')?.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('➕ Botão "Adicionar" clicado.');
      enviarMoedas('adicionar');
    });

    // Botão "Remover"
    document.getElementById('remover')?.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('➖ Botão "Remover" clicado.');
      enviarMoedas('remover');
    });
  });

  // Eventos dos popups de edição
  document.querySelectorAll('[id="editar"]').forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = botao.getAttribute('data-id');
      const popup = document.getElementById(`editarUsuario-${id}`);
      if (popup) popup.showModal();
    });
  });

  document.querySelectorAll('.close-dialog').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const dialog = botao.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  // Controle de saldo nos formulários
  document.querySelectorAll('.saldo-button').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const saldoControl = botao.closest('.saldo-control');
      const inputSaldo = saldoControl.querySelector('.saldo');
      let valorAtual = parseInt(inputSaldo.value) || 0;

      if (botao.classList.contains('add')) {
        valorAtual += 1;
      } else if (botao.classList.contains('sub')) {
        valorAtual = Math.max(0, valorAtual - 1);
      }

      inputSaldo.value = valorAtual;
    });
  });

  // Submissão dos formulários de edição
  document.querySelectorAll('.formEditar').forEach((form) => {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const dialog = this.closest('.editarUsuario');
      if (!dialog) {
        console.error('Dialog não encontrado!');
        return;
      }

      const userId = dialog.getAttribute('data-id');
      if (!userId) {
        console.error('ID do usuário não encontrado no dialog!');
        showPopup('ID do usuário não encontrado no dialog!', 'Erro', 'erro');
        return;
      }

      const nome = this.querySelector('.nome').value;
      const email = this.querySelector('.email').value;
      const ra = this.querySelector('.ra').value;
      const status = this.querySelector('input[name="is_active"]:checked').value;
      const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

      const response = await apiRequest(
        `/api/user/${userId}`,
        'PUT',
        {
          username: email,
          ra: ra,
          first_name: nome,
          is_active: status,
        },
        { 'X-CSRFToken': csrf },
      );

      if (response.status == 200) {
        const popupAlert = new Popup();
        popupAlert.showPopup('Usuário editado com sucesso!', 'Sucesso', 'sucesso');
        popupAlert.imgClosed.addEventListener("click", () => {
          window.location.reload();
        });
      } else {
        showPopup('Erro ao editar usuário: ' + (response?.error || 'Erro desconhecido'),'Erro','erro');
      }
    });
  });

  document.querySelectorAll('#concluido').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const dialog = botao.closest('dialog');
      if (dialog) dialog.close();
      window.location.reload();
    });
  });
});


async function alterarSenha(usuarioId) {
  const confirmar = await confirmarAcao('Tem certeza? O usuário receberá um e-mail com a nova senha.', 'Alterar Senha');
  if (!confirmar) return;

  try {
    const csrf =
      document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    const response = await apiRequest(
      `/api/reset-password/${usuarioId}/`,
      'POST',
      {},
      { 'X-CSRFToken': csrf },
    );
    if (response.status === 200 || response.status === 201 || response.message) {
      showPopup('Senha redefinida com sucesso!', 'Sucesso', 'sucesso');
    } else {
      showPopup('Erro ao redefinir senha: ' + response.error, 'Erro', 'erro');
    }
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    showPopup('Erro ao alterar senha: ' + error, 'Erro', 'erro');
  }
}

async function salvarEdicaoUsuario(usuarioId, formData) {
  try {
    const csrf =
      document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    const response = await apiRequest(
      `/api/user/${usuarioId}`,
      'PUT',
      formData,
      { 'X-CSRFToken': csrf },
    );

    if (response.status === 200) {
      showPopup('Usuário atualizado com sucesso!', 'Sucesso', 'sucesso');
      return true;
    } else {
      showPopup('Erro ao atualizar usuário: ' + response.error, 'Erro', 'erro');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    showPopup('Erro ao salvar edição: ' + error, 'Erro', 'erro');
    return false;
  }
}

function configurarPopupEdicao(popup, usuario) {
  popup.querySelector('.close-dialog')?.addEventListener('click', () => {
    popup.close();
  });

  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.close();
  });

  const ativarBtn = popup.querySelector('.ativar');
  const desativarBtn = popup.querySelector('.desativar');
  const statusInput = popup.querySelector('input[name="is_active"]');

  if (ativarBtn && desativarBtn && statusInput) {
    ativarBtn.addEventListener('click', () => {
      statusInput.value = 'true';
      ativarBtn.classList.add('active');
      desativarBtn.classList.remove('active');
    });

    desativarBtn.addEventListener('click', () => {
      statusInput.value = 'false';
      desativarBtn.classList.add('active');
      ativarBtn.classList.remove('active');
    });
  }
  console.log('Configuração do popup para usuário ID:', usuario.id);
  const btnAlterarSenha = popup.querySelector('.alterarSenha');
  if (btnAlterarSenha) {
    btnAlterarSenha.addEventListener('click', () => alterarSenha(usuario.id));
  }

  const form = popup.querySelector('.formEditar');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nome = form.querySelector('.nome')?.value;
      const email = form.querySelector('.email')?.value;
      const ra = form.querySelector('.ra')?.value;
      const is_active = form.querySelector('input[name="is_active"]')?.value;

      const sucesso = await salvarEdicaoUsuario(usuario.id, {
        username: email,
        ra: ra,
        first_name: nome,
        is_active: is_active,
      });

      if (sucesso) {
        popup.close();
        buscarUsuario();
      }
    });
  }
}

function renderizarUsuarios(usuarios, container) {
  container.innerHTML = '';
  const popupContainer = document.body;

  usuarios.forEach((usuario) => {
    const popupExistente = document.getElementById(
      `editarUsuario-${usuario.id}`,
    );
    if (popupExistente) popupExistente.remove();
  });

  usuarios.slice(0, 5).forEach((usuario) => {
    const div = document.createElement('div');
    div.className = 'linhaUsuario-listaDeUsuarios';
    if (!usuario.is_active) div.classList.add('desativado-listaDeUsuarios');

    div.innerHTML = `
      <input type="checkbox" class="checkbox" ${
        !usuario.is_active ? 'disabled' : ''
      }>
      <div class="infoUser-listaDeUsuarios">
        <img src="/static/img/userBlack.png" alt="">
        <input type="hidden" class="idUser-listaDeUsuarios" value="${
          usuario.id
        }">
        <span class="nome-listaDeUsuarios">${usuario.first_name}</span>
        <span>D$ ${usuario.saldo}</span>
        <span class="status-listaDeUsuarios">${
          usuario.is_active ? 'Ativo' : 'Desativado'
        }</span>
      </div>
      <img class="iconeEditar-listaDeUsuarios" data-id="${
        usuario.id
      }" src="/static/img/edit.png" alt="Editar">
    `;

    const iconeEditar = div.querySelector('.iconeEditar-listaDeUsuarios');
    iconeEditar.addEventListener('click', () => {
      const popup = document.getElementById(`editarUsuario-${usuario.id}`);
      if (popup) popup.showModal();
    });

    container.appendChild(div);

    const popupHTML = `
      <dialog id="editarUsuario-${usuario.id}" data-id="${
      usuario.id
    }" class="editarUsuario">
        <div class="dialog-header">
          <img src="/static/img/logoAdmin.png" alt="LogoAdmin" class="dialog-logo" />
          <button class="close-dialog">
            <img src="/static/img/iconeX.png" alt="Fechar" class="close-icon" />
          </button>
        </div>
        <form class="formEditar">
          <input type="hidden" name="csrfmiddlewaretoken" value="${
            document.querySelector('[name=csrfmiddlewaretoken]')?.value || ''
          }">
          <input type="hidden" class="idUser" value="${usuario.id}" />
          <input type="hidden" name="is_active" value="${
            usuario.is_active ? 'true' : 'false'
          }" />
          <div class="form-columns">
            <div class="form-left">
              <div class="form-group">
                <label for="nome-${
                  usuario.id
                }" class="form-label">Nome do Usuário</label>
                <input type="text" id="nome-${
                  usuario.id
                }" class="form-input nome" value="${usuario.first_name}" />
              </div>
              <div class="form-group">
                <label for="email-${
                  usuario.id
                }" class="form-label">Email</label>
                <input type="email" id="email-${
                  usuario.id
                }" class="form-input email" value="${usuario.username}" />
              </div>
              <div class="form-group">
                <label for="ra-${
                  usuario.id
                }" class="form-label">RA do Usuário</label>
                <input type="number" id="ra-${
                  usuario.id
                }" class="form-input ra" value="${usuario.ra || ''}" />
              </div>
            </div>
            <div class="form-right">
              <div class="action-buttons">
                <button type="button" class="action-button alterarSenha" data-id="${
                  usuario.id
                }">Alterar senha</button>
                <button type="button" class="action-button desativar">Desativar usuário</button>
                <button type="button" class="action-button ativar">Ativar usuário</button>
                <button type="submit" class="action-button submit">Concluído</button>
              </div>
            </div>
          </div>
        </form>
      </dialog>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = popupHTML;
    const popupElement = tempDiv.firstElementChild;
    popupContainer.appendChild(popupElement);

    configurarPopupEdicao(popupElement, usuario);
  });
}

async function buscarUsuario() {
  const searchInput = document.getElementById('barraBusca-listaProdutos');
  const nome = searchInput.value;

  try {
    const response = await apiRequest(
      `/api/user/?nome=${encodeURIComponent(nome)}`,
    );

    if (!response || !Array.isArray(response)) {
      showPopup('Resposta inválida ou vazia', 'Erro', 'erro');
      console.log('Resposta inválida ou vazia');
      return;
    }

    const container = document.getElementById('listaUsuarios');
    renderizarUsuarios(response, container);
    searchInput.focus();
  } catch (error) {
    showPopup('Erro ao buscar usuários: ' + error, 'Erro', 'erro');
    console.log('Erro ao buscar usuários:', error);
    searchInput.focus();
  }
}

// Evento de busca com debounce
document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('barraBusca-listaProdutos');
  let timeout = null;

  searchInput.addEventListener('input', function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      buscarUsuario();
    }, 600);
  });
});

document.addEventListener('DOMContentLoaded', function () {
const addUsuariosEmMassa = document.getElementById('addUsuariosEmMassa');
const popup = document.getElementById('popupUsuariosEmMassa');
const formUsuariosEmMassa = document.getElementById('formUsuariosEmMassa');

addUsuariosEmMassa.addEventListener('click', () => {  
  popup.showModal();
});

const fecharUsuariosEmMassa = document.getElementById('fecharUsuariosEmMassa');
fecharUsuariosEmMassa.addEventListener('click', () => {
  popup.close();
});

formUsuariosEmMassa.addEventListener('submit', async (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário

  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];

  if (!file) {
      showPopup('Nenhum arquivo selecionado.', 'Erro', 'erro');
      console.log('Nenhum arquivo selecionado.');
      return;
  }

  const formData = new FormData();
  formData.append('csv_file', file);

  const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  console.log('enviando arquivo...')
  const popupLoading = new Popup();
  popupLoading.showLoadingPopup('Processando arquivo ...');

  try {
      const response = await fetch('/api/usuarios/cadastrar-em-massa/', {
          method: 'POST',
          body: formData,
          headers: {
              'X-CSRFToken': csrfToken
          }
      });

      const data = await response.json();

      popupLoading.hidePopup();

      if (response.ok) {
          const popupAlert = new Popup();
          popupAlert.showPopup('Usuários cadastrados com sucesso!', 'Sucesso', 'sucesso');
          popup.close();
          popupAlert.imgClosed.addEventListener("click", () => {
              window.location.reload();
          });
      } else {
          const errorMessage = data.error || data.detail || 'Ocorreu um erro desconhecido.';
          showPopup('Erro ao cadastrar usuários: ' + errorMessage, 'Erro', 'erro');
      }
  } catch (error) {
      showPopup('Erro ao cadastrar usuários: ' + error.message, 'Erro', 'erro');
  }
});


})

document.addEventListener('DOMContentLoaded', function(){
  const btnZerarPontuacao = document.querySelector('.zerarPontuacao-listaDeUsuarios')
  const dialog = document.getElementById('ZerarDialog')
  const btnCancelar = document.getElementById('cancelarZerar')
  const btnConfirmar = document.getElementById('confirmarBtn')

  btnZerarPontuacao.addEventListener('click', () => {
    dialog.showModal()
  })

  btnCancelar.addEventListener('click', () => {
    dialog.close()
  })

  btnConfirmar.addEventListener('click', async () => {
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const loadingPopup = new Popup();
    loadingPopup.showLoadingPopup('Zerando pontuação...');

    try {
        const response = await fetch('api/zerarPontuacao/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify({})
        });

        loadingPopup.hidePopup();

        if (response.ok) {
            const data = await response.json();
            showPopup(data.message || 'Pontuação zerada com sucesso!', 'Sucesso', 'sucesso');
            dialog.close();
        } else {
            const errorData = await response.json().catch(() => ({}));
            showPopup(errorData.message || 'Erro ao zerar pontuação.', 'Erro', 'erro'); 
        }
    } catch (error) {
        loadingPopup.hidePopup();
        console.error('Erro:', error);
        showPopup('Erro ao zerar pontuação: ' + error, 'Erro', 'erro');
    }
});
  

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });
})

document.getElementById('fecharZerarDialog')?.addEventListener('click', () => {
  document.getElementById('ZerarDialog').close();
});