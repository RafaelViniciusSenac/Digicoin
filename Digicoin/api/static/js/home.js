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
    
        if(senha != confirmarSenha){
            alert('As senhas devem ser iguais');
            return;
        }
    
        const response = await fetch(`/api/usuario/${userId}/primeiro-acesso/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: JSON.stringify({ senha, confirmarSenha })
        });
    
        const data = await response.json();
        if (response.status == 200) {
            alert(data.mensagem);
            window.location.href = '/' 
        } else {
            alert(data.erro || "Erro ao atualizar a senha.");
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
