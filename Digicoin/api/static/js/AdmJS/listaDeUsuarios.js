document.addEventListener('DOMContentLoaded', () => {
  const popupCadastrarUsuario = document.getElementById('popupCadastrarUsuario');
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');
  const botaoCadastrarUsuario = document.getElementById('cadastrarUsuario');
  const form = document.getElementById("formUsuario");
  const popupAdicionarMoedas = document.getElementById('popupAdicionarMoedas');
  const addMoedas = document.getElementById('addMoedas');
  const fecharAdicionarMoedas = document.getElementById('fecharAdicionarMoedas');
  const popupImportarUsuarios = document.getElementById('popupImportarUsuarios');
  const abrirImportarUsuarios = document.getElementById('abrirImportarUsuarios');
  const formImportarUsuarios = document.getElementById('formImportarUsuarios');
  const fecharImportarUsuarios = document.getElementById('fecharImportarUsuarios');
  const botaoValidarUsuarios = document.getElementById('botaoValidarImportarUsuarios');
  const botaoCadastrarValidados = document.getElementById('botaoCadastrarUsuariosValidados');
  const botaoNovoArquivo = document.getElementById('botaoNovoArquivo');

  botaoNovoArquivo.addEventListener('click', () => {
    fecharImportarUsuarios.click();
    abrirImportarUsuarios.click();
  });

  abrirImportarUsuarios.addEventListener('click', () => {
    popupImportarUsuarios.showModal();
  });
  fecharImportarUsuarios.addEventListener('click', () => {
    const urlImg = formImportarUsuarios.getAttribute('data-urlimg');
    formImportarUsuarios.reset();
    formImportarUsuarios.style.display = 'block';
    document.getElementById("localResultadoValidacao").style.display = "none";
    const label = document.querySelector('.UploadBox.uploadUsuarios .default-content');
    label.innerHTML = `
        <img src="${urlImg}" alt="uploadIcon" class="upload-icon">
        <hr>
        <small>Arraste e solte o arquivo aqui</small>
        <small>para realizar upload</small>
        <hr>
        <small>CSV - XLSX</small>
    `;
    document.querySelector('.UploadBox.uploadUsuarios').classList.remove('has-image');
    popupImportarUsuarios.close();
  });

  addUsuarios.addEventListener('click', () => {
    let tipo_usuario = addUsuarios.getAttribute('data-tipo-usuario');
    tipo_usuario === "true" ? tipo_usuario = true : tipo_usuario = false;
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
          totalSelecionas.textContent = 'para ' + document.getElementById('quantidadeTotalUsuarios').value + ' usuários';
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
  botaoValidarUsuarios.addEventListener('click', () => {
    validarArquivoUsuarios();
  });

  let listaUsuariosValidados = [];
  async function validarArquivoUsuarios() {
    const form = document.getElementById("formImportarUsuarios");
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData(form);
    const popupAlert = new Popup();
    try {
      const result = await apiRequest('/validar_importacao_usuarios/', 'POST', formData, {'X-CSRFToken': csrf,});
      
      if (result.ok && Array.isArray(result.data.usuarios)) {
        listaUsuariosValidados = result.data.usuarios;
        popupAlert.showPopup("Arquivo validado com sucesso!<br>Confere os usuários abaixo:","Sucesso","sucesso");
        const lista = document.getElementById("listaUsuariosValidados");
        const localQtd = document.getElementById("quantidadeUsuariosValidados");
        lista.innerHTML = ""; // Limpa a lista anterior
        console.log(result.data.usuarios);
        listaUsuariosValidados.forEach(usuario => {
          const li = document.createElement("li");
          li.textContent = `${usuario.first_name} (${usuario.username}) - RA: ${usuario.ra}`;
          lista.appendChild(li);
        });
        localQtd.textContent = 'Total de Usuarios: ' + result.data.usuarios.length;
        //esconder o form para aparece somente o resultado
        form.style.display = "none";
        document.getElementById("localResultadoValidacao").style.display = "block";

      } else {
          popupAlert.showPopup(`Erro: ${result.status} - ${result.data?.erro || result.error}`,"Error","erro");
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  botaoCadastrarValidados.addEventListener("click", () => {
    if (listaUsuariosValidados.length > 0) {
        cadastrarUsuariosValidados(listaUsuariosValidados);
    } else {
        const popupAlert = new Popup();
        popupAlert.showPopup("Nenhum usuário validado para cadastrar.", "Error", "erro");
    }
  });

  document.getElementById('arquivoUsuarios').addEventListener('change', function () {
      const label = document.querySelector('.UploadBox.uploadUsuarios .default-content');
      if (this.files.length > 0) {
          label.innerHTML = `<small>Arquivo selecionado:</small><strong>${this.files[0].name}</strong>`;
          document.querySelector('.UploadBox.uploadUsuarios').classList.add('has-image');
      }
  });


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
