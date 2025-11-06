document.addEventListener('DOMContentLoaded', () => {
  // --- Lógica para submeter a busca automaticamente ---
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('barraBusca-listaDeUsuarios');
  let debounceTimer;

  if (searchInput.value) {
      searchInput.focus(); 
      const valLength = searchInput.value.length;
      searchInput.setSelectionRange(valLength, valLength);
  }
  
  searchInput?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    // Espera 500ms após o usuário parar de digitar para recarregar a página com o filtro
    debounceTimer = setTimeout(() => {
      searchForm.submit();
    }, 400);
  });

  // --- Elementos e Eventos dos Popups ---
  const popupCadastrarUsuario = document.getElementById('popupCadastrarUsuario');
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');
  addUsuarios?.addEventListener('click', () => popupCadastrarUsuario.showModal());
  fecharCadastrar?.addEventListener('click', () => popupCadastrarUsuario.close());

  const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
  const addMoedas = document.getElementById('addMoedas');
  const fecharAdicionarMoedas = document.getElementById('fecharAdicionarMoedas');
  fecharAdicionarMoedas?.addEventListener('click', () => popupAdicionarMoedas.close());

  const addUsuariosEmMassa = document.getElementById('addUsuariosEmMassa');
  const popupUsuariosEmMassa = document.getElementById('popupUsuariosEmMassa');
  const fecharUsuariosEmMassa = document.getElementById('fecharUsuariosEmMassa');
  addUsuariosEmMassa?.addEventListener('click', () => popupUsuariosEmMassa.showModal());
  fecharUsuariosEmMassa?.addEventListener('click', () => popupUsuariosEmMassa.close());

  // --- Lógica do "Zerar Pontuação" ---
  const btnZerarPontuacao = document.querySelector('.zerarPontuacao-listaDeUsuarios');
  const zerarDialog = document.getElementById('ZerarDialog');
  const btnCancelarZerar = document.getElementById('cancelarZerar');
  const btnConfirmarZerar = document.getElementById('confirmarBtn');
  const fecharZerarDialog = document.getElementById('fecharZerarDialog');

  btnZerarPontuacao?.addEventListener('click', () => {
    zerarDialog.showModal();
  });

  btnCancelarZerar?.addEventListener('click', () => {
    zerarDialog.close();
  });

  fecharZerarDialog?.addEventListener('click', () => {
    zerarDialog.close();
  });

  btnConfirmarZerar?.addEventListener('click', async () => {
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const loadingPopup = new Popup();
    loadingPopup.showLoadingPopup('Zerando pontuação...');

    try {
        const response = await fetch('/api/zerarPontuacao/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf
            },
            body: JSON.stringify({})
        });

        loadingPopup.hidePopup();
        const data = await response.json();

        if (response.ok) {
            showPopup(data.message || 'Pontuação zerada com sucesso!', 'Sucesso', 'sucesso');
            zerarDialog.close();
            setTimeout(() => {
              location.reload();
            }, 1500);
        } else {
            showPopup(data.message || 'Erro ao zerar pontuação.', 'Erro', 'erro'); 
        }
    } catch (error) {
        loadingPopup.hidePopup();
        showPopup('Erro ao zerar pontuação: ' + error, 'Erro', 'erro');
        window.location.reload();
    }
  });

  // --- Lógica de Seleção de Usuários ---
  const selecionarTodos = document.getElementById('selecionarTodos');
  const listaUsuarios = document.getElementById('listaUsuarios');
  let todosSelecionadosGlobalmente = false;
  let cacheSelecaoManual = new Set();
  let cacheTodosUsuarios = [];

  function getUsuariosSelecionados() {
    if (todosSelecionadosGlobalmente) {
      return cacheTodosUsuarios;
    }
    return Array.from(cacheSelecaoManual).map((id) => ({ id }));
  }

  selecionarTodos?.addEventListener('change', async (e) => {
    const checked = e.target.checked;
    todosSelecionadosGlobalmente = checked;
    if (checked) {
      try {
        const res = await fetch('/api/usuarios/ativos-nao-admin/');
        if (!res.ok) throw new Error('Erro ao buscar usuários ativos');
        const data = await res.json();
        cacheTodosUsuarios = data.map((usuario) => ({ id: parseInt(usuario.id, 10) })).filter((u) => !isNaN(u.id));
        if (cacheTodosUsuarios.length === 0) throw new Error('Nenhum ID válido encontrado');
        cacheSelecaoManual.clear();
      } catch (err) {
        showPopup('Erro ao carregar usuários: ' + err.message, 'Erro', 'erro');
        selecionarTodos.checked = false;
        todosSelecionadosGlobalmente = false;
      }
    }
  });

  listaUsuarios?.addEventListener('change', (e) => {
    if (!e.target.classList.contains('checkbox')) return;
    const linha = e.target.closest('.linhaUsuario-listaDeUsuarios');
    const inputId = linha.querySelector('.idUser-listaDeUsuarios');
    const userId = inputId ? parseInt(inputId.value, 10) : null;
    if (!userId) return;

    if (e.target.checked) {
      cacheSelecaoManual.add(userId);
    } else {
      cacheSelecaoManual.delete(userId);
    }
  });

  // --- Lógica de Gerenciamento de Moedas ---
    addMoedas?.addEventListener('click', () => {
      const usuariosSelecionados = getUsuariosSelecionados();
      if (usuariosSelecionados.length === 0) {
        showPopup('Nenhum usuário selecionado!', 'Erro', 'erro');
        return;
      }
      popupAdicionarMoedas.showModal();
      const csrf = document.querySelector('[name=csrfmiddlewaretoken]')?.value;

      const enviarMoedas = async (operacao) => {
        // pegar o valor dentro da função, no momento do clique
        const inputQuantidadetela = document.getElementById('saldo').value;
        const valor = parseInt(inputQuantidadetela.replace(/\./g, ""), 10);

        if (isNaN(valor) || valor <= 0) {
          showPopup('Digite um valor válido e positivo!', 'Erro', 'erro');
          return;
        }
        
      else if (valor > 100000000) {
        showPopup('Digite um valor menor ou igual a 100 Mil!', 'Erro', 'erro');
        return;
      }
      
      try {
        await Promise.all(usuariosSelecionados.map(usuario => 
          apiRequest(`/api/user/${usuario.id}`, 'PUT', { operacao, saldo: valor }, { 'X-CSRFToken': csrf })
        ));
        const popupAlert = new Popup();
        popupAlert.showPopup(`Operação realizada com sucesso para ${usuariosSelecionados.length} usuários!`, 'Sucesso', 'sucesso');
        popupAdicionarMoedas.close();
        popupAlert.imgClosed.addEventListener("click", () => window.location.reload());
      } catch (error) {
        showPopup('Erro na operação: ' + error.message, 'Erro', 'erro');
      }
    };
    
    document.getElementById('adicionar').onclick = (e) => { e.preventDefault(); enviarMoedas('adicionar'); };
    document.getElementById('remover').onclick = (e) => { e.preventDefault(); enviarMoedas('remover'); };
  });


  // --- Lógica de Cadastro em Massa ---
  const formUsuariosEmMassa = document.getElementById('formUsuariosEmMassa');
  formUsuariosEmMassa?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('csvFileInput');
    if (!fileInput.files[0]) {
      showPopup('Nenhum arquivo selecionado.', 'Erro', 'erro');
      return;
    }
    const formData = new FormData(formUsuariosEmMassa);
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const popupLoading = new Popup();
    popupLoading.showLoadingPopup('Processando arquivo ...');
    try {
      const response = await fetch('/api/usuarios/cadastrar-em-massa/', {
        method: 'POST',
        body: formData,
        headers: { 'X-CSRFToken': csrfToken },
      });
      const data = await response.json();
      popupLoading.hidePopup();
      if (response.ok) {
        const popupAlert = new Popup();
        popupAlert.showPopup('Usuários cadastrados com sucesso!', 'Sucesso', 'sucesso');
        popupUsuariosEmMassa.close();
        popupAlert.imgClosed.addEventListener("click", () => window.location.reload());
      } else {
        showPopup('Erro ao cadastrar usuários: ' + (data.error || data.detail), 'Erro', 'erro');
      }
    } catch (error) {
      popupLoading.hidePopup();
      showPopup('Erro ao cadastrar usuários: ' + error.message, 'Erro', 'erro');
    }
  });

  // --- INICIALIZAÇÃO DA PÁGINA ---
  document.querySelectorAll('.iconeEditar-listaDeUsuarios').forEach(botaoEditar => {
    const idUsuario = botaoEditar.getAttribute('data-id');
    const popup = document.getElementById(`editarUsuario-${idUsuario}`);

    if (popup) {
      botaoEditar.addEventListener('click', () => {
        popup.showModal();
      });
      configurarPopupEdicao(popup, { id: idUsuario });
    }
  });

  
      const modais = [
          document.getElementById("popupCadastrarUsuario"),
          document.getElementById("popupAdicionarMoedas"),
          document.getElementById("popupUsuariosEmMassa"),
          ...document.querySelectorAll(".editarUsuario"),
          document.getElementById("ZerarDialog")
      ];

      modais.forEach(modal => {
          if (!modal) return;

          modal.addEventListener("click", (event) => {
              const rect = modal.getBoundingClientRect();
              const clicouFora =
                  event.clientX < rect.left ||
                  event.clientX > rect.right ||
                  event.clientY < rect.top ||
                  event.clientY > rect.bottom;

              if (clicouFora) {
                  modal.close();

                  // Limpar todos os formulários dentro do modal
                  const forms = modal.querySelectorAll("form");
                  forms.forEach(form => form.reset());
              }
          });
      });

});

// === FUNÇÕES GLOBAIS ===

async function alterarSenha(usuarioId) {
  const confirmar = await confirmarAcao('Tem certeza? O usuário receberá um e-mail com a nova senha.', 'Alterar Senha');
  if (!confirmar) return;

  try {
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    const response = await apiRequest(`/api/reset-password/${usuarioId}/`, 'POST', {}, { 'X-CSRFToken': csrf });
    if (response) {
      showPopup('Senha redefinida com sucesso!', 'Sucesso', 'sucesso');
    } else {
      showPopup('Erro ao redefinir senha: ' + (response.error || 'Erro desconhecido'), 'Erro', 'erro');
    }
  } catch (error) {
    showPopup('Erro ao alterar senha: ' + error, 'Erro', 'erro');
  }
}

function configurarPopupEdicao(popup, usuario) {
  const closeButton = popup.querySelector('.close-dialog');
  closeButton?.addEventListener('click', () => popup.close());

  const form = popup.querySelector('.formEditar');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = {
        username: form.querySelector('.email')?.value,
        ra: form.querySelector('.ra')?.value,
        first_name: form.querySelector('.nome')?.value,
        is_active: form.querySelector('input[name="is_active"]:checked')?.value,
      };
      const csrf = form.querySelector('[name=csrfmiddlewaretoken]').value;
      const response = await apiRequest(`/api/user/${usuario.id}`, 'PUT', formData, { 'X-CSRFToken': csrf });

      if (response.status === 200) {
        const popupAlert = new Popup();
        popupAlert.showPopup('Usuário editado com sucesso!', 'Sucesso', 'sucesso');
        popup.close();
        popupAlert.imgClosed.addEventListener("click", () => window.location.reload());
      } else {
        showPopup('Erro ao editar usuário: ' + (response.error || 'Erro desconhecido'), 'Erro', 'erro');
      }
    };
  }
}