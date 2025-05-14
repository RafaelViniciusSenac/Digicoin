async function Login(evento) {
    evento.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;

    try {
        const data = await apiRequest(
            '/api/login/',
            'POST',
            { nome: email, senha: senha },
            { 'X-CSRFToken': csrf }
        );

        if (data.is_adm === true) {
            window.location.href = '/listaDeUsuarios';
        } else if (data.is_adm === false) {
            window.location.href = '/home/';
        } else {
            alert("Usuário sem permissão.");
        }

    } catch (error) {
        console.error('Erro ao logar:', error);
        alert('Email ou senha inválidos.');
    }
}

document.getElementById('loginForm').addEventListener('submit', Login);
