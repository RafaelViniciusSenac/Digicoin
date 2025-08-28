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
  selecionarTodos.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll(
      '.linhaUsuario-listaDeUsuarios:not(.desativado) .checkbox',
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
      checkbox.disabled = false;
    });
  });

  document
    .querySelectorAll(
      '.linhaUsuario-listaDeUsuarios:not(.desativado) .checkbox',
    )
    .forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const allChecked = [
          ...document.querySelectorAll(
            '.linhaUsuario-listaDeUsuarios:not(.desativado) .checkbox',
          ),
        ].every((checkbox) => checkbox.checked);
        selecionarTodos.checked = allChecked;
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
      botao.addEventListener('click', (e) => {
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
      const userId = dialog.id.split('-')[1];

      const nome = this.querySelector('.nome').value;
      const email = this.querySelector('.email').value;
      const ra = this.querySelector('.ra').value;
      const saldo = this.querySelector('.saldo').value;
      const status = this.querySelector('input[name="is_active"]').value;
      const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

      const response = await apiRequest(
        `/api/user/${userId}`,
        'PUT',
        {
          username: email,
          ra: ra,
          first_name: nome,
          saldo: saldo,
          is_active: status,
        },
        {
          'X-CSRFToken': csrf,
        },
      );

      if (response.status == 200) {
        console.log(response);

        location.reload();
      } else {
        console.log('Erro ao editar usuário: ' + response);
        alert('Erro ao editar usuário!');
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

  addMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.showModal();
    const usuariosSelecionados = getUsuariosSelecionados();

    const formAdicionarMoedas = document.getElementById('formAdicionarMoedas');
    const inputQuantidade = document.getElementById('saldo');

    const enviarMoedas = async (operacao) => {
      const valor = parseInt(inputQuantidade.value);
      const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
      if (isNaN(valor)) {
        alert('Digite um valor válido!');
        return;
      }

      try {
        for (const usuario of usuariosSelecionados) {
          const response = await apiRequest(
            `/api/user/${usuario.id}`,
            'PUT',
            {
              operacao: operacao,
              saldo: valor,
            },
            {
              'X-CSRFToken': csrf,
            },
          );

          if (response.status !== 200) {
            console.log(response.status);
            throw new Error(`Falha ao atualizar usuário ${usuario.id}`);
          }
        }
        alert('Operação realizada com sucesso!');
        popupAdicionarMoedas.close();
        location.reload();
      } catch (error) {
        console.error('Erro:', error);
        alert(`Erro na operação: ${error.message}`);
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

function renderizarUsuarios(usuarios, container) {
  usuarios.slice(0, 5).forEach((usuario) => {
    const div = document.createElement('div');
    div.className = 'linhaUsuario-listaDeUsuarios';
    div.innerHTML = `
            <input type="checkbox" class="checkbox">
            <div class="infoUser-listaDeUsuarios">
                <img src="/static/img/userBlack.png" alt="">
                <input type="hidden" class="idUser-listaDeUsuarios" value="${usuario.id}">
                <span class="nome-listaDeUsuarios">${usuario.first_name}</span>
                <span>D$ ${usuario.saldo}</span>
                <span class="status-listaDeUsuarios"></span>
            </div>
            <img class="iconeEditar-listaDeUsuarios" id="editar" data-id="${usuario.id}" src="/static/img/edit.png" alt="">
        `;
    container.appendChild(div);
  });
}

async function buscarUsuario() {
  const nome = document.getElementById('barraBusca-listaProdutos').value;

  try {
    const response = await apiRequest(
      `/api/user/?nome=${encodeURIComponent(nome)}`,
    );
    console.log(response);

    if (!response) {
      console.log('Resposta inválida');
      return;
    } else {
      const container = document.getElementById('listaUsuarios');
      container.innerHTML = '';
      renderizarUsuarios(response, container);
    }
  } catch (error) {
    console.log('Erro ao buscar usuários:', error);
  }
}

document
  .getElementById('barraBusca-listaProdutos')
  .addEventListener('input', buscarUsuario);
