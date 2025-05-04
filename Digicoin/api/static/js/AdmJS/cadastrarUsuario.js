async function cadastrar(evento) {
    evento.preventDefault();
    const nome = document.getElementById("nome").value
    var email = document.getElementById("email").value 
    const ra = document.getElementById("ra").value 
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value
    const senha = document.getElementById("senha").value
   

    try {
        const response = await apiRequest("/api/user/", "POST", {nome:email, senha:senha, ra:ra, first_name:nome }, {'X-CSRFToken':csrf});

        if(response.status == 201)
        {
            alert("Usuário cadastrado com sucesso!")
            document.getElementById("nome").value = ''
            document.getElementById("email").value = ''
            document.getElementById("ra").value = ''
            document.getElementById("senha").value = ''

            console.log(response);
        }
        else{
            console.log("erro ao cadastrar" + response);
        }

    } catch (error) {
        console.log("Deu erro" + error);
    }
    
}

