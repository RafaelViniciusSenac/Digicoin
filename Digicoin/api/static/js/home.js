document.addEventListener('DOMContentLoaded', () => {
    const primeiroAcesso = document.getElementById('primeiroAcesso').value
    const popUpPrimeiroAcesso = document.getElementById('popUpPrimeiroAcesso')
    const userId = document.getElementById('userId').value
    
    if(primeiroAcesso == 'True'){
        popUpPrimeiroAcesso.showModal()
    }
    async function primeiroAcessoSenha(event){
        event.preventDefault();
        const popupAlerta = new Popup()
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        const userId = document.getElementById('userId').value;
    
        if(senha != confirmarSenha){
            popupAlerta.showPopup('As senhas devem ser iguais', 'Erro', 'erro')
            return;
        }
        popupAlerta.showLoadingPopup('Atualizando senha...')
        const response = await fetch(`/api/usuario/${userId}/primeiro-acesso/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ senha, confirmarSenha })
        });
    
        const data = await response.json();
        popupAlerta.hidePopup();
        if (response.status == 200) {
            popupAlerta.showPopup(data.mensagem, 'Sucesso', 'sucesso')
            //atualiza quando clikar no botao fechar do popup
            popupAlerta.imgClosed.addEventListener("click", () => {
                window.location.href = '/'
            })
        } else {
            popupAlerta.showPopup(data.erro || "Erro ao atualizar a senha.", 'Erro', 'erro')
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
