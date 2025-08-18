async function cadastrar(evento) {
    evento.preventDefault();

    const form = document.getElementById("formUsuario");
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const ra = document.getElementById("ra").value;
    let isAdmin = document.getElementById("isAdmin").value;
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const senha = document.getElementById("senha").value;
    const is_active = document.getElementById("filtroAtivarUsuario").checked;
    const id_usuario = parseInt(document.getElementById("id_usuario").value) || 0;
    isAdmin === "true" ? isAdmin = true : isAdmin = false;
    let dados = {};
    let response;
    const popupAlert = new Popup();
    // passsar o isAdmin para boolean
    
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
