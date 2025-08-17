document.addEventListener('DOMContentLoaded', () => {
  const popupCadastrarUsuario = document.getElementById('popupCadastrarUsuario');
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');
  const botaoCadastrarUsuario = document.getElementById('cadastrarUsuario');
  const form = document.getElementById("formUsuario");

  addUsuarios.addEventListener('click', () => {
    const tipo_usuario = addUsuarios.getAttribute('data-tipo-usuario');
    let tituloBotao = 'Cadastrar Usuário';
    if(tipo_usuario){
      document.getElementById('isAdmin').value = tipo_usuario;
      tituloBotao = 'Cadastrar Usuário Admin';
    }
    botaoCadastrarUsuario.textContent = tituloBotao
    popupCadastrarUsuario.showModal();
  });

  fecharCadastrar.addEventListener('click', () => {
    form.reset();
    popupCadastrarUsuario.close();
  });

  const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
  const addMoedas = document.getElementById('addMoedas');
  const fecharAdicionarMoedas = document.getElementById('fecharAdicionarMoedas');

  fecharAdicionarMoedas.addEventListener('click', () => {
    popupAdicionarMoedas.close();
  });

  if(document.getElementById('selecionarTodos')){
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
  }
  document.querySelectorAll(
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
      let tituloBotao = 'Alterar Usuário';
      const nome = editar[i].getAttribute('data-nome');
      const email = editar[i].getAttribute('data-email');
      const ra = editar[i].getAttribute('data-ra');
      let status = editar[i].getAttribute('data-status');
      const tipo_usuario = editar[i].getAttribute('data-tipo-usuario');
      if(tipo_usuario){
        tituloBotao = 'Alterar Usuário Admin';
      }
      console.log(status);
      botaoCadastrarUsuario.textContent = tituloBotao;
      document.getElementById('id_usuario').value = id;
      document.getElementById('nome').value = nome;
      document.getElementById('email').value = email;
      document.getElementById('ra').value = ra;
      if (status == 'true') {
        document.getElementById('filtroAtivarUsuario').checked = true;
      }
      // escondor a div de senha
      document.getElementById('inputSenha').style.display = 'none'; 
      popupCadastrarUsuario.showModal();
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

  if (addMoedas) { 
    addMoedas.addEventListener('click', () => {
      popupAdicionarMoedas.showModal();
      // verfica se selecionarTodos esta marcado
      const usuariosSelecionados = getUsuariosSelecionados();
      const selecionarTodos = document.getElementById('selecionarTodos');
      const totalSelecionas = document.getElementById('usuariosSelecionados')
      let paraTodos = false;
      if (selecionarTodos.checked) {
          paraTodos = true;
          totalSelecionas.textContent = document.getElementById('quantidadeTotalUsuarios').value;
      }else{
        totalSelecionas.textContent = usuariosSelecionados.length;;
      }
      const formAdicionarMoedas = document.getElementById('formAdicionarMoedas');
      const inputQuantidade = document.getElementById('saldo');
      const popupAlert = new Popup();
      const enviarMoedas = async (operacao) => {
        const valor = parseInt(inputQuantidade.value);
        const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

        if (isNaN(valor)) {
          popupAlert.showPopup("Digite um valor válido!","Error","erro");
          return;
        }

        const payload = {
          operacao: operacao,
          saldo: valor,
          paraTodos: paraTodos,
          usuarios: paraTodos ? [] : usuariosSelecionados.map(u => u.id),
        };
        console.log(payload);
        try {
          const result = await apiRequest('/api/user/atualizar-saldos/', 'PUT', payload, {'X-CSRFToken': csrf,});
          if (result.ok) {
              popupAdicionarMoedas.close();
              formAdicionarMoedas.reset();
              popupAlert.showPopup(result.data.message,"Sucesso","sucesso");
              popupAlert.imgClosed.addEventListener("click", () => {
                  location.reload();
              });
          } else {
              popupAlert.showPopup(`Erro: ${result.status} - ${result.data?.erro || result.error}`,"Error","erro");
          }
        } catch (error) {
          console.error('Erro:', error);
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
  }

  function getUsuariosSelecionados() {
    const linhas = document.querySelectorAll('.linhaUsuario-listaDeUsuarios');
    const usuarios = [];

    linhas.forEach((linha) => {
      const checkbox = linha.querySelector('.checkbox');
      const inputId = linha.querySelector('.idUser-listaDeUsuarios');
      const saldoElement = linha.querySelector('.saldo-listaDeUsuarios');

      if (checkbox && checkbox.checked && inputId && saldoElement) {
        const saldo = parseInt(saldoElement.textContent.replace('D$ ', '')) || 0;
        usuarios.push({
          id: inputId.value,
          saldo: saldo,
        });
      }
    });
    if (usuarios.length === 0) {
      popupAdicionarMoedas.close();
      const popupAlert = new Popup();
      popupAlert.showPopup("Nenhum usuário selecionado!","Error","erro");
    }
    return usuarios;
  }

});

function buscarUsuario() {
    const nome = document.getElementById('campoBusca').value;
    const container = document.querySelector('.barraPesquisa-listaDeUsuarios');
    const baseUrl = container.getAttribute('data-url');

    const params = new URLSearchParams();

    if (nome.trim() !== "") {
        params.append("nome", nome.trim());
    }

    const checkbox = document.getElementById('filtroAdmin');
    if (checkbox && checkbox.checked) {
        params.append("is_adm", "true");
    }

    window.location.href = baseUrl + "?" + params.toString();
}

document.getElementById('filtroAdmin').addEventListener('change', function () {
    buscarUsuario(); // ou qualquer outra função que você queira
});
