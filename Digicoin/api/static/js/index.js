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
        if (data === null) {
            const popup = new Popup();
            popup.showPopup("Email ou senha inválidos.","Error","erro"); // Exibe a mensagem de erro, (mensagem, titulo, tipo)
            return;
        }
        if (data.is_adm === true) {
            window.location.href = '/listaDeUsuarios';
        } else if (data.is_adm === false) {
            window.location.href = '/home/';
        }

    } catch (error) {
        console.error('Erro ao logar:', error);
        const popup = new Popup();
        popup.showPopup("Email ou senha inválidos.","Error,","erro"); // Exibe a mensagem de erro, (mensagem, titulo, tipo)
    }
}

document.getElementById('loginForm').addEventListener('submit', Login);
