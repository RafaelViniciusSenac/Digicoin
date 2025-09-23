document.addEventListener('DOMContentLoaded', () => {
  const popupCadastrarUsuario = document.getElementById(
    'popupCadastrarUsuario',
  );
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');
  const cadastrarUsuario = document.getElementById('cadastrarUsuario');

  addUsuarios.addEventListener('click', () => {
    popupCadastrarUsuario.showModal();
  });

  fecharCadastrar.addEventListener('click', () => {
    popupCadastrarUsuario.close();
  });

  const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
  const addMoedas = document.getElementById('addMoedas');
  const fecharAdicionarMoedas = document.getElementById(
    'fecharAdicionarMoedas',
  );

  fecharAdicionarMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.close();
  });

  const selecionarTodos = document.getElementById('selecionarTodos');
  const listaUsuarios = document.getElementById('listaUsuarios');
  let usuariosSelecionadosCache = [];

  selecionarTodos?.addEventListener('change', async (e) => {
    const checked = e.target.checked;

    if (checked) {
      try {
        const res = await fetch('/api/usuarios/ativos-nao-admin/');
        if (!res.ok) throw new Error('Erro ao buscar usuários ativos');

        const data = await res.json();
        console.log('Todos os usuários ativos do back-end:', data);

        usuariosSelecionadosCache = data
          .map((usuario) => ({
            id: parseInt(
              usuario.id || usuario.user_id || usuario.id_usuario,
              10,
            ),
          }))
          .filter((u) => !isNaN(u.id));

        if (usuariosSelecionadosCache.length === 0) {
          throw new Error('Nenhum ID válido encontrado nos dados da API');
        }

        // alert(`Todos os ${usuariosSelecionadosCache.length} usuários ativos foram selecionados!`);

        listaUsuarios
          .querySelectorAll(
            '.linhaUsuario-listaDeUsuarios:not(.desativado-listaDeUsuarios) .checkbox',
          )
          .forEach((cb) => (cb.checked = true));
      } catch (err) {
        // console.error('❌ Erro ao buscar todos os usuários:', err);
        // alert('Erro ao selecionar todos os usuários.');
        selecionarTodos.checked = false;
        usuariosSelecionadosCache = [];
      }
    } else {
      // Desmarca tudo
      usuariosSelecionadosCache = [];
      listaUsuarios
        .querySelectorAll(
          '.linhaUsuario-listaDeUsuarios:not(.desativado-listaDeUsuarios) .checkbox',
        )
        .forEach((cb) => (cb.checked = false));
    }
  });

  function getUsuariosSelecionados() {
    if (selecionarTodos.checked && usuariosSelecionadosCache.length > 0) {
      // console.log('✅ Usuários selecionados do cache (API):', usuariosSelecionadosCache);
      return usuariosSelecionadosCache; // Já está no formato { id: number }
    }

    // Seleção manual via checkboxes
    const selecionados = Array.from(
      listaUsuarios.querySelectorAll(
        '.linhaUsuario-listaDeUsuarios:not(.desativado-listaDeUsuarios) .checkbox',
      ),
    )
      .filter((cb) => cb.checked)
      .map((cb) => {
        const linha = cb.closest('.linhaUsuario-listaDeUsuarios');
        const inputId = linha.querySelector('.idUser-listaDeUsuarios');
        const userId = inputId ? parseInt(inputId.value, 10) : null;
        return userId ? { id: userId } : null;
      })
      .filter(Boolean); // Remove nulos

    // console.log('✅ Usuários selecionados do DOM:', selecionados);
    return selecionados;
  }

  addMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.showModal();
    const usuariosSelecionados = getUsuariosSelecionados();
    const inputQuantidade = document.getElementById('saldo');
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

    if (usuariosSelecionados.length === 0) {
      alert('Nenhum usuário selecionado!');
      return;
    }

    const enviarMoedas = async (operacao) => {
      const valor = parseInt(inputQuantidade.value);
      if (isNaN(valor)) {
        alert('Digite um valor válido!');
        return;
      }

      try {
        const promessas = usuariosSelecionadosCache.map(async (usuario) => {
          const response = await apiRequest(
            `/api/user/${usuario.id}`,
            'PUT',
            { operacao, saldo: valor },
            { 'X-CSRFToken': csrf },
          );

          if (response.status !== 200) {
            throw new Error(
              `Falha ao atualizar usuário ${usuario.id}: ${response.status}`,
            );
          }

          return response;
        });

        const resultados = await Promise.all(promessas);
        // alert(
        //   `Operação realizada com sucesso para ${resultados.length} usuários!`,
        // );
        popupAdicionarMoedas.close();
        location.reload();
      } catch (error) {
        console.error('Erro:', error);
        // alert(`Erro na operação: ${error.message}`);
      }
    };

    document.getElementById('adicionar').addEventListener('click', (e) => {
      e.preventDefault();
      enviarMoedas('adicionar');
    });

    document.getElementById('remover').addEventListener('click', (e) => {
      e.preventDefault();
      enviarMoedas('remover');
    });
  });

  const editar = document.querySelectorAll('[id="editar"]');
  for (let i = 0; i < editar.length; i++) {
    editar[i].addEventListener('click', () => {
      const id = editar[i].getAttribute('data-id');
      const popupEditarUsuario = document.getElementById(`editarUsuario-${id}`);
      popupEditarUsuario.showModal();
    });
  }

  document.querySelectorAll('.close-dialog').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const dialog = botao.closest('dialog');
      if (dialog) {
        dialog.close();
      }
    });
  });

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

  document
    .querySelectorAll('.action-button.desativar, .action-button.ativar')
    .forEach((botao) => {
      
      botao.addEventListener('click', () => {
        const dialog = botao.closest('dialog');
        const form = dialog.querySelector('.formEditar');
        const statusInput = form.querySelector('input[name="is_active"]');

        if (botao.classList.contains('desativar')) {
          statusInput.value = 'false';
        } else if (botao.classList.contains('ativar')) {
          statusInput.value = 'true';
        }

        dialog
          .querySelectorAll('.action-button')
          .forEach((btn) => btn.classList.remove('active'));
        botao.classList.add('active');
      });
    });

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
        alert('Erro: ID do usuário não encontrado.');
        return;
      }

      const nome = this.querySelector('.nome').value;
      const email = this.querySelector('.email').value;
      const ra = this.querySelector('.ra').value;
      const status = this.querySelector('input[name="is_active"]').value;
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
        {
          'X-CSRFToken': csrf,
        },
      );

      if (response.status == 200 ) {
        console.log(response);
        alert('Usuário editado com sucesso!');
        location.reload();
      } else {
        alert('Erro ao editar usuário: ' + (response?.error || 'Erro desconhecido'));
        
      }
    });
  });

  const concluido = document.querySelectorAll('#concluido');

  concluido.forEach((botao) => {
    botao.addEventListener('click', (e) => {
      const dialog = botao.closest('dialog');
      if (dialog) {
        dialog.close();
      }
      window.location.reload();
    });
  });

  function getUsuariosSelecionados() {
    const linhas = document.querySelectorAll('.linhaUsuario-listaDeUsuarios');
    const usuarios = [];

    linhas.forEach((linha) => {
      const checkbox = linha.querySelector('.checkbox');
      const inputId = linha.querySelector('.idUser-listaDeUsuarios');
      const saldoElement = linha.querySelector('span:not(.nome):not(.status)');

      if (checkbox && checkbox.checked && inputId && saldoElement) {
        const saldo =
          parseInt(saldoElement.textContent.replace('D$ ', '')) || 0;
        usuarios.push({
          id: inputId.value,
          saldo: saldo,
        });
      }
    });
    if (usuarios.length === 0) {
      alert('Nenhum usuário selecionado.');
      popupAdicionarMoedas.close();
    }

    return usuarios;
  }
});

async function alterarSenha(usuarioId) {
  const confirmar = confirm(
    'Tem certeza? O usuário receberá um e-mail com a nova senha.',
  );
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

    if (response.status === 200) {
      alert(
        response.message || 'Senha redefinida e e-mail enviado com sucesso!',
      );
    } else {
      alert('Erro: ' + (response.error || 'Erro desconhecido'));
    }
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    alert('Erro ao conectar com o servidor.');
  }
}

// 👇 Função para salvar edição de usuário
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
      alert('Usuário atualizado com sucesso!');
      return true;
    } else {
      alert('Erro ao atualizar usuário.');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar edição:', error);
    alert('Erro ao conectar com o servidor.');
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
      <dialog id="editarUsuario-${usuario.id}" data-id="${usuario.id}" class="editarUsuario">
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
      console.log('Resposta inválida ou vazia');
      return;
    }

    const container = document.getElementById('listaUsuarios');
    renderizarUsuarios(response, container);

    searchInput.focus();
  } catch (error) {
    console.log('Erro ao buscar usuários:', error);

    searchInput.focus();
  }
}

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

const addUsuariosEmMassa = document.getElementById('addUsuariosEmMassa');
addUsuariosEmMassa.addEventListener('click', () => {
  const popup = document.getElementById('popupUsuariosEmMassa');
  popup.showModal();
});