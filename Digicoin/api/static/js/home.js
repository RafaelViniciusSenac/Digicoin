document.addEventListener('DOMContentLoaded', () => {
    const primeiroAcesso = document.getElementById('primeiroAcesso').value
    const popUpPrimeiroAcesso = document.getElementById('popUpPrimeiroAcesso')
    const userId = document.getElementById('userId').value
    
    if(primeiroAcesso == 'True'){
        popUpPrimeiroAcesso.showModal()
    }

    async function primeiroAcessoSenha(event){
        event.preventDefault();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const userId = document.getElementById('userId').value;
        const alertPopup = new Popup();
        if(senha != confirmarSenha){
            alertPopup.showPopup('As senhas devem ser iguais', 'Erro', 'erro');
            // alterar cor dos campos de senha e confirmar senha para vermelho
            document.getElementById('senha').style.borderColor = 'red';
            document.getElementById('confirmarSenha').style.borderColor = 'red';
            return;
        }
        const loadingPopup = new Popup();
        loadingPopup.showLoadingPopup('Atualizando...');
        const response = await fetch(`/api/usuario/${userId}/primeiro-acesso/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ senha, confirmarSenha })
        });
    
        const data = await response.json();
        loadingPopup.hidePopup();
        if (response.status == 200) {
            alertPopup.showPopup('Senha atualizada com sucesso', 'Sucesso', 'sucesso');
            // redirecionar apos clicar no botao fechar do popup alertPopup
            alertPopup.imgClosed.addEventListener("click", () => {
                window.location.href = '/'
            });
        } else {
            alertPopup.showPopup(data.erro || 'Erro ao atualizar a senha', 'Erro', 'erro');
        }
    }

    const formPrimeiroAcesso = document.getElementById('formPrimeiroAcesso')
    formPrimeiroAcesso.addEventListener('submit', primeiroAcessoSenha)

    const botoes = document.querySelectorAll(".toggle-btn");

    botoes.forEach((botao) => {
        botao.addEventListener("click", function () {
            const id = botao.getAttribute("data-id");
            const descricao = document.getElementById("descricao-" + id);

            document.querySelectorAll(".descricao-cascata.open").forEach(el => {
                if (el !== descricao) {
                    el.classList.remove("open");
                }
            });

            descricao.classList.toggle("open");
        });
    });
});
