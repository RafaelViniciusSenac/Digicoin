document.addEventListener('DOMContentLoaded', () => {
  const popupCadastrarUsuario = document.getElementById('popupCadastrarUsuario');
  const addUsuarios = document.getElementById('addUsuarios');
  const fecharCadastrar = document.getElementById('fecharCadastrar');
  const botaoCadastrarUsuario = document.getElementById('cadastrarUsuario');
  const formUsuario = document.getElementById("formUsuario");
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
  const botaoResetarSenha = document.getElementById('botaoResetarSenha');
  const botaoFormUsuario = document.getElementById('cadastrarUsuario');
  const FecharResetarSenha = document.getElementById('fecharResetarSenha');
  const editar = document.querySelectorAll('[id="editar"]');
  const abrirResetarSenha = document.querySelectorAll('[id="abrirResetarSenha"]');
  const popupResetarSenha = document.getElementById('popupResetarSenha');

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
    formUsuario.reset();
    popupCadastrarUsuario.close();
  });

  formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    cadastrarEditarUsuario();
  });

  async function cadastrarEditarUsuario() {
    const id_usuario = parseInt(document.getElementById("id_usuario").value) || 0;
    if (!validarCamposAntesDeEnviar(id_usuario > 0 ? ["nome", "email"] : ["nome", "email", "senha"])) {
        const popupAlert = new Popup();
        popupAlert.showPopup("Preencha todos os campos obrigatórios!", "Erro", "erro");
        return;
    }
    const form = document.getElementById("formUsuario");
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const ra = document.getElementById("ra").value;
    let isAdmin = document.getElementById("isAdmin").value;
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const senha = document.getElementById("senha").value;
    const is_active = document.getElementById("filtroAtivarUsuario").checked;
    isAdmin === "true" ? isAdmin = true : isAdmin = false;
    let dados = {};
    let response;
    const popupAlert = new Popup();
    
    try {
        if (id_usuario > 0) {
            dados = {
                nome: email,
                first_name: nome,
                is_active: is_active
            };
            if (ra !== "") {
                dados.ra = ra;
            }

            response = await apiRequest(`/api/user/${id_usuario}`, "PUT", dados, { 'X-CSRFToken': csrf });
        } else {
            dados = {
                nome: email,
                senha: senha,
                first_name: nome,
                is_adm: isAdmin,
                is_active: is_active
            };
            if (ra !== "") {
                dados.ra = ra;
            }
            console.log(dados);
            response = await apiRequest("/api/user/", "POST", dados, { 'X-CSRFToken': csrf });
        }
        console.log("Resposta da requisição: ", response);
        if (response && (response.status === 201 || response.status === 200)) {
            form.reset();
            popupAlert.showPopup(id_usuario > 0 ? "Usuário editado com sucesso!" : "Usuário cadastrado com sucesso!", "Sucesso", "sucesso");
            popupAlert.imgClosed.addEventListener("click", () => {
                location.reload();
            });
        } else {
            popupAlert.showPopup(id_usuario > 0 ? "Erro ao editar usuário!" : "Erro ao cadastrar usuário!", "Erro", "erro");
            console.log("Erro ao cadastrar: ", response);
        }

    } catch (error) {
        console.log("Deu erro: ", error);
        popupAlert.showPopup("Erro inesperado ao cadastrar/editar usuário.", "Erro", "erro");
    }
  }

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

  for (let i = 0; i < editar.length; i++) {
    editar[i].addEventListener('click', () => {
      const id = editar[i].getAttribute('data-id');
      let tituloBotao = 'Alterar Usuário';
      const nome = editar[i].getAttribute('data-nome');
      const email = editar[i].getAttribute('data-email');
      const ra = editar[i].getAttribute('data-ra');
      let status = editar[i].getAttribute('data-status');
      let tipo_usuario = editar[i].getAttribute('data-tipo-usuario');
      tipo_usuario === "true" ? tipo_usuario = true : tipo_usuario = false;
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

  for (let i = 0; i < abrirResetarSenha.length; i++) {
    abrirResetarSenha[i].addEventListener('click', () => {
      const id = abrirResetarSenha[i].getAttribute('data-id');
      let tituloBotao = 'Resetar Senha';
      const nome = abrirResetarSenha[i].getAttribute('data-nome');
      const email = abrirResetarSenha[i].getAttribute('data-email');

      document.getElementById('id_usuario_reset').value = id;
      document.getElementById('nome_usuario_reset').textContent = nome;
      document.getElementById('email_usuario_reset').textContent = email;
      popupResetarSenha.showModal();
    });
  }

  FecharResetarSenha.addEventListener('click', () => {
    popupResetarSenha.close();
  });

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
        if (!validarCamposAntesDeEnviar(["saldo"])) {
              const popupAlert = new Popup();
              popupAlert.showPopup("Preencha o campo de quantidade!", "Erro", "erro");
              return;
        }
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
          if (result.status === 200) {
              popupAdicionarMoedas.close();
              formAdicionarMoedas.reset();
              popupAlert.showPopup(result.message,"Sucesso","sucesso");
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
    if (!validarCamposAntesDeEnviar(["arquivoUsuarios"])) {
        const popupAlert = new Popup();
        popupAlert.showPopup("Selecione um arquivo para importar!", "Erro", "erro");
        return;
    }
    const form = document.getElementById("formImportarUsuarios");
    const arquivoInput = document.getElementById("arquivoUsuarios");

    // Verifica se algum arquivo foi selecionado
    if (!arquivoInput.files || arquivoInput.files.length === 0) {
        const popupAlert = new Popup();
        popupAlert.showPopup("Nenhum arquivo selecionado!", "Erro", "erro");
        return; // Impede o envio
    }

    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const formData = new FormData(form);
    const popupAlert = new Popup();
    const loadingPopup = new Popup();
    loadingPopup.showLoadingPopup('Carregando...');
    try {
      // preciso receber a lista de usarios validados json
      const result = await fetch('/validar_importacao_usuarios/', {
        method: 'POST',
        headers: {
          'X-CSRFToken': csrf,
        },
        body: formData,
      }).then(response => {
        return response.json();
      });
      if (result.status === 200 && result.usuarios.length > 0) {
        loadingPopup.hidePopup();
        listaUsuariosValidados = result.usuarios;
        popupAlert.showPopup("Arquivo validado com sucesso!<br>Confere os usuários abaixo:","Sucesso","sucesso");
        const lista = document.getElementById("listaUsuariosValidados");
        const localQtd = document.getElementById("quantidadeUsuariosValidados");
        lista.innerHTML = ""; // Limpa a lista anterior
        console.log(result.usuarios);
        listaUsuariosValidados.forEach(usuario => {
          const li = document.createElement("li");
          li.textContent = `${usuario.first_name} (${usuario.username}) - RA: ${usuario.ra}`;
          lista.appendChild(li);
        });
        localQtd.textContent = 'Total de Usuarios: ' + result.usuarios.length;
        //esconder o form para aparece somente o resultado
        form.style.display = "none";
        document.getElementById("localResultadoValidacao").style.display = "block";

      } else {
        loadingPopup.hidePopup();
        popupAlert.showPopup(`Erro: ${result.status} - ${result.erro}`,"Error","erro");
      }
    } catch (error) {
      console.error('Erro:', error);
      loadingPopup.hidePopup();
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

  async function cadastrarUsuariosValidados(usuarios) {
    const lista = document.getElementById("listaUsuariosValidados");
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const popupAlert = new Popup();
    if (usuarios.length === 0) {
        popupAlert.showPopup("Nenhum usuário selecionado.", "Erro", "erro");
        return;
    }
    try {
        const response = await apiRequest("/api/importar_usuarios/", "POST", {usuarios: usuarios}, { 'X-CSRFToken': csrf });

        if (response && (response.status === 201 || response.status === 200)) {
            lista.innerHTML = "";
            popupAlert.showPopup("Usuários cadastrado com sucesso!", "Sucesso", "sucesso");
            popupAlert.imgClosed.addEventListener("click", () => {
                location.reload();
            });
        } else {
            popupAlert.showPopup("Erro ao cadastrar usuários!", "Erro", "erro");
            console.log("Erro ao cadastrar: ", response);
        }

    } catch (error) {
        console.log("Deu erro: ", error);
        popupAlert.showPopup("Erro inesperado ao cadastrar usuários.", "Erro", "erro");
    }
  }

  botaoResetarSenha.addEventListener('click', (e) => {
    e.preventDefault();
    resetarSenhaDosUsuarios();
  });

  async function resetarSenhaDosUsuarios() {
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const id_usuario = parseInt(document.getElementById("id_usuario_reset").value);
    const popupAlert = new Popup();
    try {
      const response = await apiRequest("/api/resetar_senha_usuario/", "POST", {id: id_usuario}, { 'X-CSRFToken': csrf });
      console.log(response);
      if (response && (response.status === 201 || response.status === 200)) {
          popupAlert.showPopup("Senha resetada com sucesso<br>Nova Senha enviado para o email!", "Sucesso", "sucesso");
          popupAlert.imgClosed.addEventListener("click", () => {
              location.reload();
          });
      } else {
          popupAlert.showPopup("Erro ao resetar senha do usuário!", "Erro", "erro");
          console.log("Erro ao resetar: ", response);
      }
    } catch (error) {
        console.log("Deu erro: ", error);
        popupAlert.showPopup("Erro inesperado ao resetar usuário.", "Erro", "erro");
    }
  }

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


function validarCamposAntesDeEnviar(campos) {
    let valido = true;
    campos.forEach(id => {
        const campo = document.getElementById(id);
        if (!campo || (campo.type === 'file' ? campo.files.length === 0 : campo.value.trim() === "")) {
            campo.style.border = "2px solid red";
            valido = false;
        } else {
            campo.style.border = "";
        }
    });
    return valido;
}


