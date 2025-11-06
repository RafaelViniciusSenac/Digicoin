async function cadastrar(evento) {
    evento.preventDefault();
    const form = document.getElementById("formUsuario")
    const nome = document.getElementById("nome").value
    var email = document.getElementById("email").value 
    const ra = document.getElementById("ra").value 
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value
    const senha = document.getElementById("senha").value
    
    if(!nome || !email || !ra || !senha){
        showPopup('Preencha todos os campos corretamente.', 'Erro', 'erro');
        return;
    }

    const emailInput = document.getElementById("email");
    if (!emailInput.checkValidity()) {
        showPopup('Por favor, insira um e-mail válido.', 'Erro', 'erro');
        emailInput.focus();
        return;
    }
    
    try {
        const response = await apiRequest("/api/user/", "POST", {nome:email, senha:senha, ra:ra, first_name:nome, is_adm:false }, {'X-CSRFToken':csrf});
        if(response === null){
            showPopup('Erro desconhecido ao cadastrar usuário:', 'Erro', 'erro');
        }else{
            if(response)
            {
                const popupAlert = new Popup();
                popupAlert.showPopup('Usuário cadastrado com sucesso!', 'Sucesso', 'sucesso');
                form.reset();
                popupAlert.imgClosed.addEventListener("click", () => {
                    window.location.reload();
                });
                console.log(response);
            }
            else{
                showPopup('Erro ao cadastrar usuário: ' + response.error, 'Erro', 'erro');
                console.log("erro ao cadastrar" + response);
            }
        }

    } catch (error) {
        showPopup('Erro ao cadastrar usuário: ' + error, 'Erro', 'erro');
        console.log("Deu erro" + error);
    }


}

function bloqueiaCaracteresIndesejados(event) {

      const caracteresBloqueados = [",", ".", "-", "+", "e"]; 
      if (caracteresBloqueados.includes(event.key)) {
          event.preventDefault();
          return false;
      }
  }